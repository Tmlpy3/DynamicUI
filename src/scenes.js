export const SUPPORTED_ROLES = ["elder", "dad", "mom"];
export const DEFAULT_ROLE = "elder";

export const NAV_ITEMS = [
  { label: "Home", icon: "home", href: "?role=elder", primary: true },
  { label: "Devices", icon: "devices", href: "#" },
  { label: "Routines", icon: "routine", href: "#" },
  { label: "Life", icon: "wellbeing", href: "#" },
  { label: "Automations", icon: "ops", href: "#" },
  { label: "Store", icon: "package", href: "#" },
  { label: "Settings", icon: "settings", href: "#", bottom: true },
  { label: "Help", icon: "spark", href: "#", bottom: true },
];

export const SCENES = {
  elder: {
    id: "elder",
    theme: "morning-warm",
    greeting: "王奶奶，早上好",
    weather: "晴 24°C 空气优",
    time: "早上 7:30",
    primaryAction: "语音播报",
    sections: [
      {
        id: "brief",
        type: "elder-brief",
        title: "今日家中一切正常",
        cards: [
          { icon: "☀", title: "天气舒适", detail: "适合晨练，室温 24°C" },
          { icon: "💊", title: "降压药", detail: "7:30 需要服用", tone: "warn" },
          { icon: "🔒", title: "门锁", detail: "已锁好", tone: "good" },
        ],
        actions: ["我知道了", "已吃药"],
      },
      {
        id: "medicine",
        type: "medicine",
        title: "用药提醒",
        items: [
          { title: "降压药", detail: "7:30 饭后服用", tone: "alert" },
          { title: "钙片", detail: "12:00 午餐后" },
          { title: "降糖药", detail: "18:00 晚餐前" },
        ],
      },
      {
        id: "health",
        type: "metrics",
        title: "健康概览",
        items: [
          { value: "128/82", label: "血压正常" },
          { value: "350", label: "步数，目标 3,000" },
          { value: "24°C", label: "室内温度舒适" },
          { value: "62kg", label: "体重稳定" },
        ],
      },
      {
        id: "quick-actions",
        type: "quick-actions",
        title: "一键操作",
        items: [
          { icon: "💡", title: "灯光", detail: "打开" },
          { icon: "❄", title: "空调", detail: "25°C" },
          { icon: "🔒", title: "门锁", detail: "已锁", tone: "good" },
          { icon: "👪", title: "家人", detail: "联系" },
          { icon: "🆘", title: "求助", detail: "紧急呼叫", tone: "danger" },
        ],
      },
    ],
  },
  dad: {
    id: "dad",
    theme: "morning-blue",
    greeting: "早上好，今天工作顺利",
    weather: "☀ 晴 22°C 微风",
    time: "早上 7:45",
    primaryAction: "启动出门准备",
    sections: [
      {
        id: "departure",
        type: "dad-brief",
        title: "出门前总览",
        lines: ["✅ 全屋设备运行正常", "⚡ 今日能耗 3.2 kWh", "📦 门口有 2 件包裹待取"],
        actions: ["一键出门", "我知道了"],
      },
      {
        id: "security",
        type: "security-report",
        title: "夜间安防巡检",
        status: "🔒 全夜无异常",
        events: [
          "🌙 22:00 安防模式已开启",
          "🎥 23:15 客厅 motion 记录正常",
          "🌿 01:30 后院 motion 记录正常",
          "☀ 06:30 安防模式自动解除",
        ],
        trend: "异常事件较上周下降 30%",
      },
      {
        id: "sensors",
        type: "compact-list",
        title: "传感器状态",
        items: ["🔥 烟雾传感器正常", "💧 漏水传感器正常", "💡 厨房灯仍亮", "🚪 门窗传感器正常", "🌡 温湿度传感器正常"],
      },
      {
        id: "maintenance",
        type: "maintenance",
        title: "设备维护",
        items: ["🧃 净水器滤芯需要更换", "🔋 门锁电量 78%", "🤖 扫地机器人滤芯正常", "🍃 空气净化器滤芯正常"],
        action: "一键购买耗材",
      },
      {
        id: "schedule",
        type: "schedule",
        title: "今日家庭日程",
        items: ["👦 小明 8:00 上学，15:00 放学", "👩 妈妈 16:00 瑜伽课", "👴 爷爷 10:00 体检", "📦 包裹配送 14:00-16:00"],
      },
      {
        id: "leaving",
        type: "leaving-check",
        title: "离家安全清单",
        action: "一键出门模式：全部执行",
        items: [
          "💡 卧室灯已关闭",
          "❄ 客厅空调已关闭",
          "⚠ 厨房灯仍亮",
          "🪟 卧室窗户已关闭",
          "🔒 门锁已锁定",
          "🛡 安防模式已就绪",
        ],
      },
    ],
  },
  mom: {
    id: "mom",
    theme: "evening-dark",
    greeting: "晚上好！该准备晚餐啦",
    weather: "🌙 多云 20°C 微风",
    time: "晚上 19:30",
    primaryAction: "",
    sections: [
      {
        id: "pet",
        type: "pet-care",
        title: "宠物照护",
        events: ["✅ 7:00 自动喂食完成", "💧 10:30 饮水正常", "🏃 14:00 后院活动一次", "🐱 16:00 客厅摄像头识别到猫咪"],
        water: "💧 饮水机余量 75%",
        next: "✅ 下次喂食 18:00",
        insight: "活动量比平时少 20%，建议晚饭后陪玩 15 分钟",
      },
      {
        id: "elder-care",
        type: "elder-care",
        title: "爷爷今日活动节奏",
        items: ["起床 7:00", "早餐 7:30", "散步 9:00-11:00", "午餐 12:00", "午休 13:00-14:00", "看电视 16:00"],
        status: "今日规律正常",
      },
      {
        id: "family",
        type: "family-status",
        title: "家人状态",
        items: ["👦 小明在卧室写作业", "👨 爸爸还在公司加班", "👩 妈妈在厨房做饭", "👴 爷爷在客厅看电视"],
        action: "叫小明吃饭",
      },
      {
        id: "camera",
        type: "camera-events",
        title: "摄像头事件时间线",
        events: ["📦 07:15 包裹送达", "👤 09:30 识别到爷爷", "🎉 14:22 今日精彩回放", "🐾 16:00 宠物在后院活动"],
        actions: ["今日精彩回放", "搜索事件"],
      },
      {
        id: "energy",
        type: "energy",
        title: "能源分析",
        usage: "15.2 kWh",
        cost: "预计电费 ¥185",
        split: [
          ["空调", 42],
          ["热水器", 18],
          ["冰箱", 12],
          ["其他", 28],
        ],
      },
      {
        id: "suggestions",
        type: "suggestions",
        title: "节能建议",
        items: ["❄️ 空调调到 26°C，预计节省 ¥30/月", "⏱ 18:00-21:00 避开洗衣高峰", "🔌 关闭待机设备可节省 0.8 kWh/天"],
        action: "一键执行节能建议",
      },
    ],
  },
};

export function parseRole(search = "") {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const role = params.get("role");
  return SUPPORTED_ROLES.includes(role) ? role : DEFAULT_ROLE;
}

export function getScene(role = DEFAULT_ROLE) {
  return SCENES[SUPPORTED_ROLES.includes(role) ? role : DEFAULT_ROLE];
}
