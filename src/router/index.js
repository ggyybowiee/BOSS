const Log = () => import('@/components/Log/Index.vue')
const WorkOrder = () => import('@/components/WorkOrder/Index.vue')
const DataDictionary = () => import('@/components/DataDictionary/Index.vue')
const NetElement = () => import('@/components/NetElement/Index.vue')
const Neturl = () => import('@/components/Neturl/Index.vue')
const AsyncTask = () => import('@/components/AsyncTask/Index.vue')
const AAAWorkOrder = () => import('@/components/AAAWorkOrder/Index.vue')
const FeedbackStatistics = () => import('@/components/FeedbackStatistics/Index.vue')
const AccountFree = () => import('@/components/AccountFree/Index.vue')
const InvitePrizeManage = () => import('@/components/InvitePrizeManage/Index.vue')
const InviteCodeManage = () => import('@/components/InviteCodeManage/Index.vue')
const AccountDefault = () => import('@/components/AccountDefault/Index.vue')
const ProductManage = () => import('@/components/ProductManage/Index.vue')
const PackageManage = () => import('@/components/PackageManage/Index.vue')
const AuthPolicy = () => import('@/components/AuthPolicy/Index.vue')
const AuthMessage = () => import('@/components/AuthMessage/Index.vue')
const OttManage = () => import('@/components/OttManage/Index.vue')
const TerminalManage = () => import('@/components/TerminalManage/Index.vue')
const HelpClassify = () => import('@/components/HelpClassify/Index.vue')
const HelpQuestion = () => import('@/components/HelpQuestion/Index.vue')
const Coupon = () => import('@/components/Coupon/Index.vue')

export default new VueRouter({
  routes: [{
      path: '/',
      name: 'log',
      component: Log
    },
    {
      path: '/log',
      name: 'Log',
      component: Log
    },
    {
      path: '/work-order',
      name: 'WorkOrder',
      component: WorkOrder
    },
    {
      path: '/data-dictionary',
      name: 'DataDictionary',
      component: DataDictionary
    },
    {
      path: '/net-element',
      name: 'NetElement',
      component: NetElement
    },
    {
      path: '/neturl',
      name: 'Neturl',
      component: Neturl
    },
    {
      path: '/async-task',
      name: 'AsyncTask',
      component: AsyncTask
    },
    {
      path: '/aaa-work-order',
      name: 'AAAWorkOrder',
      component: AAAWorkOrder
    },
    {
      path: '/feedback-statistics',
      name: 'FeedbackStatistics',
      component: FeedbackStatistics
    },
    {
      path: '/account-free',
      name: AccountFree,
      component: AccountFree
    },
    {
      path: '/invite-prize-manage',
      name: "InvitePrizeManage",
      component: InvitePrizeManage
    },
    {
      path: '/invite-code-manage',
      name: "InviteCodeManage",
      component: InviteCodeManage
    },
    {
      path: '/account-default',
      name: "AccountDefault",
      component: AccountDefault
    },
    {
      path: '/product-manage',
      name: "ProductManage",
      component: ProductManage
    },
    {
      path: '/package-manage',
      name: "PackageManage",
      component: PackageManage
    },
    {
      path: '/auth-policy',
      name: "AuthPolicy",
      component: AuthPolicy
    },
    {
      path: '/auth-message',
      name: "AuthMessage",
      component: AuthMessage
    },
    {
      path: '/ott-manage',
      name: "OttManage",
      component: OttManage
    },
    {
      path: '/terminal-manage',
      name: "TerminalManage",
      component: TerminalManage
    },
    {
      path: '/help-classify',
      name: "HelpClassify",
      component: HelpClassify
    },
    {
      path: '/help-question',
      name: "HelpQuestion",
      component: HelpQuestion
    },
    {
      path: '/coupon',
      name: "Coupon",
      component: Coupon
    }
  ]
})
