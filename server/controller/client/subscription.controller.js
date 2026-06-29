const Subscription = require('../../model/Subscription');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

const PLANS = {
  Standard:    { discountPercentage: 10, monthlyCost: 299,  durationMonths: 1 },
  Premium:     { discountPercentage: 20, monthlyCost: 599,  durationMonths: 2 },
  'Elite Plus':{ discountPercentage: 30, monthlyCost: 999,  durationMonths: 3 },
};

/* ── POST /api/subscriptions  — subscribe to a plan ── */
exports.subscribe = asyncHandler(async (req, res) => {
  const { plan } = req.body;

  if (!PLANS[plan]) {
    throw ApiError.badRequest(`Invalid plan. Choose: ${Object.keys(PLANS).join(', ')}`);
  }

  const { discountPercentage, monthlyCost, durationMonths } = PLANS[plan];

  // Cancel any existing active subscription
  await Subscription.updateMany(
    { user: req.user._id, status: 'active' },
    { status: 'cancelled' }
  );

  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

  const subscription = await Subscription.create({
    user: req.user._id,
    plan,
    discountPercentage,
    monthlyCost,
    expiryDate,
    status: 'active',
  });

  res.status(201).json({
    success: true,
    message: `Successfully subscribed to ${plan} plan!`,
    subscription: {
      plan: subscription.plan,
      discountPercentage: subscription.discountPercentage,
      expiryDate: subscription.expiryDate,
      status: subscription.status,
    },
  });
});

/* ── GET /api/subscriptions/my  — get my active subscription ── */
exports.getMySubscription = asyncHandler(async (req, res) => {
  const now = new Date();

  // Auto-expire any overdue subscriptions
  await Subscription.updateMany(
    { user: req.user._id, status: 'active', expiryDate: { $lt: now } },
    { status: 'expired' }
  );

  const subscription = await Subscription.findOne({
    user: req.user._id,
    status: 'active',
    expiryDate: { $gte: now },
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    subscription: subscription
      ? {
          plan: subscription.plan,
          discountPercentage: subscription.discountPercentage,
          monthlyCost: subscription.monthlyCost,
          expiryDate: subscription.expiryDate,
          status: subscription.status,
        }
      : null,
  });
});
