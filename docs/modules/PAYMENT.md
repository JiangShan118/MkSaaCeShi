# Payment Module

This module provides a flexible payment integration supporting both **Stripe** and **Creem** as payment providers, with a provider pattern that allows switching between providers via environment variable.

## Provider Selection

The payment provider is controlled by the `NEXT_PUBLIC_PAYMENT_PROVIDER` environment variable:
- `'stripe'` - Uses Stripe (default)
- `'creem'` - Uses Creem

## Structure

### Core Payment Module
- `/payment/types.ts` - Type definitions for the payment module
- `/payment/index.ts` - Main payment interface and global provider instance
- `/payment/provider/stripe.ts` - Stripe payment provider implementation
- `/payment/provider/creem.ts` - Creem payment provider implementation

### Server Actions
- `/actions/create-checkout-session.ts` - Server action for creating checkout sessions
- `/actions/create-customer-portal-session.ts` - Server action for creating customer portal sessions
- `/actions/check-payment-completion.ts` - Server action for checking payment completion status
- `/actions/create-credit-checkout-session.ts` - Server action for creating credit package checkout sessions
- `/actions/consume-credits.ts` - Server action for consuming user credits
- `/actions/get-credit-balance.ts` - Server action for getting user credit balance
- `/actions/get-credit-stats.ts` - Server action for getting credit statistics
- `/actions/get-credit-transactions.ts` - Server action for getting credit transaction history
- `/actions/get-current-plan.ts` - Server action for getting current user plan and subscription data

### API Routes
- `/app/api/webhooks/stripe/route.ts` - API route for Stripe webhook events
- `/app/api/webhooks/creem/route.ts` - API route for Creem webhook events

### Pages
- `/app/[locale]/(protected)/payment/page.tsx` - Payment processing page with status display
- `/app/[locale]/(protected)/settings/billing/page.tsx` - Account billing page to manage subscriptions
- `/app/[locale]/(protected)/settings/credits/page.tsx` - Credits management page
- `/app/[locale]/(marketing)/pricing/page.tsx` - Pricing page using the pricing table component

### Components

#### Payment Components
- `/components/payment/payment-card.tsx` - Payment status display component with polling

#### Pricing Components
- `/components/pricing/pricing-card.tsx` - Component to display a single pricing plan
- `/components/pricing/pricing-table.tsx` - Component to display all pricing plans
- `/components/pricing/create-checkout-button.tsx` - Button component to initiate checkout
- `/components/pricing/customer-portal-button.tsx` - Button component to access Stripe customer portal

#### Settings Components
- `/components/settings/billing/billing-card.tsx` - Billing management card component
- `/components/settings/credits/credit-packages.tsx` - Credit packages display component
- `/components/settings/credits/credit-checkout-button.tsx` - Credit package checkout button
- `/components/settings/credits/credit-detail-viewer.tsx` - Credit detail viewer component
- `/components/settings/credits/credit-transactions-table.tsx` - Credit transactions table component
- `/components/settings/credits/credit-transactions.tsx` - Credit transactions component
- `/components/settings/credits/credits-card.tsx` - Credits card component
- `/components/settings/credits/credits-page-client.tsx` - Credits page client component

### Hooks
- `/hooks/use-payment-completion.ts` - Hook for checking payment completion with polling
- `/hooks/use-payment.ts` - Hooks for payment-related data fetching (current plan, subscription status)
- `/hooks/use-credits.ts` - Hooks for credit-related operations (balance, stats, transactions, consumption)

## Environment Variables

The following environment variables are required:

```
# Payment Provider Selection
# Options: 'stripe' | 'creem' (default: 'stripe')
NEXT_PUBLIC_PAYMENT_PROVIDER="stripe"

# -----------------------------------------------------------------------------
# Stripe Configuration
# -----------------------------------------------------------------------------
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Public Stripe Variables (used in client components)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_LIFETIME=price_...
NEXT_PUBLIC_STRIPE_PRICE_CREDITS_BASIC=price_...
NEXT_PUBLIC_STRIPE_PRICE_CREDITS_STANDARD=price_...
NEXT_PUBLIC_STRIPE_PRICE_CREDITS_PREMIUM=price_...
NEXT_PUBLIC_STRIPE_PRICE_CREDITS_ENTERPRISE=price_...

# -----------------------------------------------------------------------------
# Creem Configuration (alternative to Stripe)
# Set NEXT_PUBLIC_PAYMENT_PROVIDER='creem' to enable
# CREEM_DEBUG=true uses test-api.creem.io (sandbox)
# -----------------------------------------------------------------------------
CREEM_DEBUG="true"
CREEM_API_KEY=...
CREEM_WEBHOOK_SECRET=whsec_...

# Creem Product IDs
NEXT_PUBLIC_CREEM_PRODUCT_PRO_MONTHLY=prod_...
NEXT_PUBLIC_CREEM_PRODUCT_PRO_YEARLY=prod_...
NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME=prod_...
NEXT_PUBLIC_CREEM_PRODUCT_CREDITS_BASIC=prod_...
NEXT_PUBLIC_CREEM_PRODUCT_CREDITS_STANDARD=prod_...
NEXT_PUBLIC_CREEM_PRODUCT_CREDITS_PREMIUM=prod_...
NEXT_PUBLIC_CREEM_PRODUCT_CREDITS_ENTERPRISE=prod_...
```

## Payment Plans

Payment plans are defined in `src/config/website.tsx`. The actual price/product IDs used are determined by the active payment provider (`NEXT_PUBLIC_PAYMENT_PROVIDER`):

```typescript
// In src/config/website.tsx
export const websiteConfig = {
  // ...other config
  payment: {
    provider: 'stripe', // or 'creem' - controlled by NEXT_PUBLIC_PAYMENT_PROVIDER
    plans: {
      free: {
        id: "free",
        prices: [],
        isFree: true,
        isLifetime: false,
      },
      pro: {
        id: "pro",
        prices: [
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!, // or Creem equivalent
            amount: 990,
            currency: "USD",
            interval: PlanIntervals.MONTH,
          },
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY!, // or Creem equivalent
            amount: 9900,
            currency: "USD",
            interval: PlanIntervals.YEAR,
          },
        ],
        isFree: false,
        isLifetime: false,
        recommended: true,
      },
      lifetime: {
        id: "lifetime",
        prices: [
          {
            type: PaymentTypes.ONE_TIME,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME!, // or Creem equivalent
            amount: 19900,
            currency: "USD",
          },
        ],
        isFree: false,
        isLifetime: true,
      }
    }
  }
}
```

## Server Actions

The payment module uses server actions for payment operations:

### Checkout Operations

#### `/actions/create-checkout-session.ts`
```typescript
// Create a checkout session for subscription plans
export const createCheckoutAction = userActionClient
  .schema(checkoutSchema)
  .action(async ({ parsedInput, ctx }) => {
    // Creates Stripe checkout session with localized URLs
    // Returns { success: true, data: { url, id } } or { success: false, error }
  });
```

#### `/actions/create-credit-checkout-session.ts`
```typescript
// Create a checkout session for credit packages
export const createCreditCheckoutAction = userActionClient
  .schema(creditCheckoutSchema)
  .action(async ({ parsedInput, ctx }) => {
    // Creates Stripe checkout session for credit purchases
    // Returns { success: true, data: { url, id } } or { success: false, error }
  });
```

### Customer Portal

#### `/actions/create-customer-portal-session.ts`
```typescript
// Create a customer portal session
export const createPortalAction = userActionClient
  .schema(portalSchema)
  .action(async ({ parsedInput, ctx }) => {
    // Creates Stripe customer portal session
    // Returns { success: true, data: { url } } or { success: false, error }
  });
```

### Payment Status & Subscription Management

#### `/actions/check-payment-completion.ts`
```typescript
// Check if a payment is completed for the given session ID
export const checkPaymentCompletionAction = userActionClient
  .schema(checkPaymentCompletionSchema)
  .action(async ({ parsedInput: { sessionId } }) => {
    // Checks payment status in database
    // Returns { success: true, isPaid: boolean } or { success: false, error }
  });
```

#### `/actions/get-current-plan.ts`
```typescript
// Get current user plan and subscription data
export const getCurrentPlanAction = userActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx }) => {
    // Returns current plan, subscription data, and lifetime status
    // Returns { success: true, data: { currentPlan, subscription } } or { success: false, error }
  });
```

### Credit System

#### `/actions/consume-credits.ts`
```typescript
// Consume user credits
export const consumeCreditsAction = userActionClient
  .schema(consumeSchema)
  .action(async ({ parsedInput, ctx }) => {
    // Deducts credits from user account
    // Returns { success: true } or { success: false, error }
  });
```

#### `/actions/get-credit-balance.ts`
```typescript
// Get user credit balance
export const getCreditBalanceAction = userActionClient
  .schema(schema)
  .action(async ({ ctx }) => {
    // Returns current credit balance
    // Returns { success: true, data: { balance: number } } or { success: false, error }
  });
```

## Core Components

### Payment Processing

#### PaymentCard
Displays payment status with automatic polling and redirect:

```tsx
<PaymentCard />
// Automatically handles payment completion checking and redirects
// Used in /app/[locale]/(protected)/payment/page.tsx
```

### Checkout Components

#### CheckoutButton
Creates a Stripe checkout session and redirects the user:

```tsx
<CheckoutButton
  userId="user_123"
  planId="pro"
  priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!}
  metadata={{ userId: "user_123" }}
  variant="default"
  size="default"
>
  Subscribe
</CheckoutButton>
```

#### CreditCheckoutButton
Creates a Stripe checkout session for credit packages:

```tsx
<CreditCheckoutButton
  userId="user_123"
  packageId="credits_100"
  priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_100!}
  metadata={{ userId: "user_123" }}
  variant="default"
  size="default"
>
  Buy Credits
</CreditCheckoutButton>
```

### Customer Portal

#### CustomerPortalButton
Redirects the user to the Stripe customer portal:

```tsx
<CustomerPortalButton
  userId="user_123"
  returnUrl="/settings/billing"
  variant="outline"
  size="default"
>
  Manage Subscription
</CustomerPortalButton>
```

### Pricing Components

#### PricingTable
Displays all pricing plans with interval selection:

```tsx
<PricingTable
  metadata={{ userId: "user_123" }}
  currentPlan="pro"
/>
```

#### PricingCard
Displays a single pricing plan with checkout button:

```tsx
<PricingCard
  plan={plan}
  interval="month"
  paymentType="SUBSCRIPTION"
  metadata={{ userId: "user_123" }}
  isCurrentPlan={false}
/>
```

### Billing Management

#### BillingCard
Displays current subscription and billing information:

```tsx
<BillingCard />
// Shows current plan, next billing date, and management options
```

### Credit System

#### CreditPackages
Displays available credit packages for purchase:

```tsx
<CreditPackages />
// Shows credit packages with purchase buttons
```

#### CreditsPageClient
Complete credits management interface:

```tsx
<CreditsPageClient />
// Shows balance, transactions, and purchase options
```

## Webhooks

Webhook events are handled by separate routes based on the payment provider:

### Stripe Webhooks
Handled via `/app/api/webhooks/stripe/route.ts`, which calls the `handleWebhookEvent` function from the payment module.

### Creem Webhooks
Handled via `/app/api/webhooks/creem/route.ts`, which calls the `handleWebhookEvent` function from the payment module.

The webhook handler processes events like:

- `checkout.session.completed` (Stripe) / `checkout.completed` (Creem)
- `customer.subscription.created` (Stripe) / `subscription.created` (Creem)
- `customer.subscription.updated` (Stripe) / `subscription.updated` (Creem)
- `customer.subscription.deleted` (Stripe) / `subscription.cancelled` (Creem)
- `invoice.paid` (Stripe)

The webhook functionality is implemented in the `handleWebhookEvent` method of each payment provider.

## Integration Steps

### 1. Choose a Payment Provider
Set `NEXT_PUBLIC_PAYMENT_PROVIDER` to either `'stripe'` or `'creem'` (default: `'stripe'`).

### 2. Configure Provider Settings

**For Stripe:**
1. Set up Stripe account and get API keys from https://dashboard.stripe.com
2. Create products and prices in the Stripe dashboard
3. Configure webhook endpoints in the Stripe dashboard:
   - `https://your-domain.com/api/webhooks/stripe`

**For Creem:**
1. Set up Creem account and get API key from https://creem.io dashboard
2. Create products in the Creem dashboard
3. Set `CREEM_DEBUG=true` for sandbox testing (uses test-api.creem.io)
4. Configure webhook endpoints in the Creem dashboard:
   - `https://your-domain.com/api/webhooks/creem`

### 3. Add Environment Variables
Add the appropriate environment variables for your chosen provider to your project.

### 4. Add Components
Add the pricing page and account billing components to your application.

## Error Handling

The payment module includes error handling for:

- Missing environment variables
- Failed checkout session creation
- Invalid webhooks
- User permission checks
- Network/API failures

## Testing

For testing, use Stripe's test mode and test credit cards:

- 4242 4242 4242 4242 - Successful payment
- 4000 0000 0000 3220 - 3D Secure authentication required
- 4000 0000 0000 9995 - Insufficient funds failure

## Hooks

### Payment Hooks

#### usePaymentCompletion
Hook for checking payment completion with automatic polling:

```typescript
const { data: paymentCheck, isLoading, error } = usePaymentCompletion(
  sessionId,
  enablePolling // true for automatic polling
);
// Returns { isPaid: boolean }
```

#### useCurrentPlan
Hook for getting current plan based on subscription and lifetime status:

```typescript
const { data: currentPlan, isLoading, error } = useCurrentPlan(userId);
// Returns { currentPlan: PricePlan | null, subscription: Subscription | null }
```

### Credit Hooks

#### useCreditBalance
Hook for fetching user credit balance:

```typescript
const { data: balance, isLoading, error } = useCreditBalance();
// Returns { balance: number }
```

#### useCreditStats
Hook for fetching credit statistics:

```typescript
const { data: stats, isLoading, error } = useCreditStats();
// Returns credit usage statistics
```

#### useConsumeCredits
Hook for consuming credits:

```typescript
const { mutate: consumeCredits, isPending } = useConsumeCredits();
// Usage: consumeCredits({ amount: 10, description: "AI generation" })
```

#### useCreditTransactions
Hook for fetching credit transaction history:

```typescript
const { data: transactions, isLoading, error } = useCreditTransactions(
  pageIndex,
  pageSize,
  search,
  sorting
);
// Returns paginated transaction data
```

## Global Functions

The main payment interface in `/payment/index.ts` provides these global functions:

```typescript
// Create a checkout session for a plan
createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult>;

// Create a customer portal session
createCustomerPortal(params: CreatePortalParams): Promise<PortalResult>;

// Create a credit checkout session
createCreditCheckout(params: CreateCreditCheckoutParams): Promise<CheckoutResult>;

// Get a customer by ID
getCustomer(params: GetCustomerParams): Promise<Customer | null>;

// Handle a webhook event
handleWebhookEvent(payload: string, signature: string): Promise<void>;
```

## Payment Flow

The payment flow is similar for both providers, with the specific checkout URL being generated by the active payment provider.

### Subscription Payment Flow
1. User clicks `CheckoutButton` with plan details
2. `createCheckoutAction` creates a checkout session via the active provider
3. User is redirected to the provider's checkout page
4. After payment, user is redirected to `/payment` page
5. `PaymentCard` component polls `checkPaymentCompletionAction`
6. Once payment is confirmed, user is redirected to billing page
7. Webhook updates database with subscription details

### Credit Purchase Flow
1. User clicks `CreditCheckoutButton` with package details
2. `createCreditCheckoutAction` creates a checkout session via the active provider
3. User is redirected to the provider's checkout page
4. After payment, user is redirected to `/payment` page
5. `PaymentCard` component polls `checkPaymentCompletionAction`
6. Once payment is confirmed, user is redirected to credits page
7. Webhook updates database with credit purchase details

### Payment Status Polling
The `PaymentCard` component uses `usePaymentCompletion` hook to:
- Poll `checkPaymentCompletionAction` every 2 seconds
- Display loading, success, failed, or timeout states
- Automatically redirect to callback URL on success
- Invalidate relevant React Query cache
