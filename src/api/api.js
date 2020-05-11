export default {
  // 获取权限树
  resourceTree: () => '/api/cas/resourceTree',
  // 日志管理
  operation: () => '/api/log/operation',
  // 工单管理
  workOrder: () => '/api/net/workOrder',
  // 数据字典
  dictionary: () => '/api/boss/dictionary',
  // 配置中心-网元管理
  netElementInfo: () => '/api/workorder/netElementInfo',
  // 配置中心-网元管理-关联策略
  neSyncPolicy: () => '/api/workorder/neSyncPolicy',
  // 配置中心-网元接口
  netApi: () => '/api/workorder/netApi',
  // 配置中心-异步任务
  asyncTask: () => '/api/boss/asyncTask',
  // 配置中心-aaa工单
  aaaWorkOrder: () => '/api/bossAgent/workOrder',
  // 用户反馈-反馈统计
  userFeedback: () => '/api/feedback/userFeedback',
  // 用户反馈-反馈统计-导出下载
  download: () => '/api/feedback/FebackDownload',
  // 账号管理-免费试用-应用id
  portalInfo: () => '/api/boss/portalInfo',
  // 账号管理-免费试用-获取产品列表
  product: () => '/api/boss/product',
  // 账号管理-免费试用
  freeProduct: () => "/api/boss/freeProduct",
  // 账号管理-同步
  noticeSyncMetadata: () => '/api/boss/noticeSyncMetadata',
  // 邀请有奖管理
  inviteRules: () => '/api/boss/inviteRules',
  // 邀请有奖管理 发布/取消发布
  inviteRulesRelease: () => '/api/boss/inviteRulesRelease',
  // 邀请有奖管理 产品关联/取消关联
  inviteRulesRefProduct: () => '/api/boss/inviteRulesRefProduct',
  // 邀请有奖管理 优惠券关联/取消关联
  inviteRulesRefCoupon: () => '/api/boss/inviteRulesRefCoupon',
  // 邀请码管理-查询
  inviteCode: () => "/api/boss/inviteCode",
  // 邀请码管理-同步
  syncInviteCodeStatus: () => '/api/boss/syncInviteCodeStatus',
  // 邀请码管理-邀请记录
  inviterInviteRecord: () => "/api/boss/inviterInviteRecord",
  // 邀请码管理-邀请奖励
  inviterRewardRecord: () => "/api/boss/inviterRewardRecord",
  // 邀请码管理-被邀请奖励
  inviteeRewardRecord: () => "/api/boss/inviteeRewardRecord",
  // 默认账号查询
  defaultAccount: () => '/api/boss/defaultAccount',
  // 默认账号-账号权益
  getAuthInfo: () => '/api/boss/getAuthInfo',
  // 产品管理-校验产品编码唯一性
  productCheck: () => '/api/boss/productCheck',
  // 产品管理-获取套餐列表
  package: () => '/api/boss/package',
  // 产品管理-套餐关联/取消关联
  packageRefProduct: () => '/api/boss/packageRefProduct',
  // 产品管理-获取授权列表
  authPolicy: () => '/api/boss/authPolicy',
  // 产品管理-关联/取消关联授权策略
  authPolicyRefPackage: () => '/api/boss/authPolicyRefPackage',
  // 操作员
  operator: () => '/api/cas/operator',
  // 授权管理-授权策略-关联产品
  authPolicyRefProduct: () => '/api/boss/authPolicyRefProduct',
  // 授权管理-授权策略-查询终端
  terminal: () => '/api/boss/terminal',
  // 授权管理-授权策略-关联终端
  authPolicyRefTerminal: () => '/api/boss/authPolicyRefTerminal',
  // 授权管理-授权信息-查询
  authInfo: () => '/api/boss/authInfo',
  // 授权管理-授权信息-授权信息批量维护
  authInfoBatchBmt: () => '/api/boss/authInfoBatchBmt',
  // 授权管理-授权信息-批量修改授权状态
  authInfoStatus: () => '/api/boss/authInfoStatus',
  // 授权管理-授权信息-导出授权信息
  downloadAuthInfoForExcel: () => '/api/boss/downloadAuthInfoForExcel',
  // 用户管理-OTT用户管理
  ottAccount: () => '/api/boss/ottAccount',
  // 用户管理-终端用户管理-导出终端信息
  downloadTerminalForExcel: () => '/api/boss/downloadTerminalForExcel',
  // 用户管理-终端用户管理-批量生成账号
  accountBatchAdd: () => '/api/boss/accountBatchAdd',
  // 用户管理-终端用户管理-批量修改市场状态
  terminalInfoStatus: () => '/api/boss/terminalInfoStatus',
  // 用户管理-终端用户管理-批量修改终端状态
  terminalInfoTerStatus: () => '/api/boss/terminalInfoTerStatus',
  // 用户管理-终端用户管理-批量修改终端关联策略
  terminalMultiRelPolicy: () => '/api/boss/terminalMultiRelPolicy',
  // 用户管理-终端用户管理-批量修改终端ID所属客户
  terminalCustomer: () => '/api/boss/terminalCustomer',
  // 帮助中心-查询所属应用
  getAppIdList: () => '/api/help/app',
  // 帮助中心-帮助分类-查询
  getHelpClassify: () => '/api/help/type',
  // 帮助中心-帮助分类-发布/取消发布
  releaseType: () => '/api/help/releaseType',
  // 帮助中心-帮助问题-查询
  getHelpQuestion: () => '/api/help/helpCenter',
  // 帮助中心-帮助问题-发布/取消发布
  releaseQuestion: () => '/api/help/releaseQuestion',
  // 优惠券管理-查询应用
  getCouponAppIdList: () => '/api/payCoreManage/getAppIdList',
  // 优惠券管理-查询
  couponRules: () => '/api/boss/couponRules',
  // 优惠券管理-发布/取消发布
  couponRulesRelease: () => '/api/boss/couponRulesRelease',
  // 优惠券管理-查询会员套餐列表
  getPackageList: () => "/api/payCoreManage/getPackageList"
}
