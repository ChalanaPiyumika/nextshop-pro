export const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_DOMAIN = "izxkbf-9g.myshopify.com";
const SHOPIFY_TOKEN = "804a44e8b133b425297bf9a1ef049c50";
const STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export type Money = { amount: string; currencyCode: string };
export type ShopifyProduct = {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: { minVariantPrice: Money };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: { edges: Array<{ node: { id: string; title: string; price: Money; availableForSale: boolean; selectedOptions: Array<{ name: string; value: string }> } }> };
    options: Array<{ name: string; values: string[] }>;
  };
};

export async function storefrontApiRequest<T>(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(STOREFRONT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Shopify request failed (${response.status})`);
  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join(", "));
  return payload.data;
}

const PRODUCT_FIELDS = `id title description handle priceRange { minVariantPrice { amount currencyCode } } images(first: 8) { edges { node { url altText } } } variants(first: 20) { edges { node { id title availableForSale price { amount currencyCode } selectedOptions { name value } } } } options { name values }`;

export async function getProducts(first = 12): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest<{ products: { edges: ShopifyProduct[] } }>(
    `query Products($first: Int!) { products(first: $first) { edges { node { ${PRODUCT_FIELDS} } } } }`,
    { first },
  );
  return data?.products.edges ?? [];
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest<{ product: ShopifyProduct["node"] | null }>(
    `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
    { handle },
  );
  return data?.product ? { node: data.product } : null;
}

export const CART_QUERY = `query Cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;
export const CART_CREATE = `mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { id checkoutUrl lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } } } userErrors { field message } } }`;
export const CART_ADD = `mutation CartAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } } } userErrors { field message } } }`;
export const CART_UPDATE = `mutation CartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } userErrors { field message } } }`;
export const CART_REMOVE = `mutation CartRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } userErrors { field message } } }`;

export function formatMoney(money: Money) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: money.currencyCode }).format(Number(money.amount));
}