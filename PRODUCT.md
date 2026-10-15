# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Kitch serves a shared household. Household members use one meal plan, pantry, recipe history, and native grocery cart while each active member keeps an individual nutrition log. In hosted use, one Google account owns the household and members switch their active profile inside Kitch.

## Product Purpose

Kitch reduces the everyday work of deciding what to eat, planning dated meals, creating recipes, tracking pantry stock, preparing grocery carts, and logging personal nutrition. Success means conversational requests and visible household state stay understandable, consistent, and easy to review.

## Positioning

Kitch connects household meal planning, pantry awareness, recipes, provider-independent grocery intent, provider-specific cart preparation, and personal nutrition in one conversational kitchen workflow.

## Operating Context

People use Kitch for short, recurring household tasks: checking upcoming meals, changing a plan, asking for a recipe, updating pantry stock, preparing groceries, reviewing a delivery-provider cart, and logging food. Conversation is the primary control surface; structured pages show the resulting shared or personal state.

## Capabilities and Constraints

- Household meal plans are date-specific and shared.
- Recipes and recipe-derived groceries stay connected, while manual grocery rows remain possible.
- The native grocery cart is provider-independent; Instamart and future providers translate that intent into live provider carts.
- External checkout requires explicit UI review and approval. Chat does not place orders or execute payments.
- Household memory uses Vertex AI Memory Bank in the normal development and hosted environments; structured state uses Supabase.
- Personal nutrition follows the active member. Pantry, plans, recipes, and groceries belong to the household.
- Google Sign-In protects the hosted household; local development still uses the hosted persistence services.

## Brand Commitments

- Product name: Kitch.
- Preserve the chef-hat mark, kitchen imagery, and recognizable forest-green culinary identity.
- The interface should feel practical, calm, trustworthy, and domestic—not clinical, gamified, or generically “AI”.
- Avoid unnecessary eyebrow labels, decorative pills, translucent controls, and visual changes unrelated to the requested UI work.

## Evidence on Hand

- Product requirements: `docs/vision_and_requirements.md`
- UX flows: `docs/ux_user_flows.md`
- Architecture: `docs/system_architecture.md`
- Existing brand and product assets: `frontend/public/`
- Functional blueprint and test evidence: `test/functional_testing_blueprint.md` and `docs/test_artifacts/`

No testimonials, commercial claims, or benchmark data are available and none should be fabricated.

## Product Principles

1. Shared household planning, personal nutrition.
2. Clarity over invisible automation.
3. Fast everyday use through natural conversation.
4. Pantry-aware grocery preparation with explicit provider review.
5. Consistency across pages and interaction patterns.

## Accessibility & Inclusion

Kitch should remain keyboard operable, preserve visible focus, support zoom and reduced motion, provide clear labels for controls, and remain usable on laptop, desktop, and mobile viewports.
