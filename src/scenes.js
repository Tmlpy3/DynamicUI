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
    greeting: "Good morning, Grandma Wang",
    weather: "Sunny 24°C, clean air",
    time: "Morning 7:30",
    primaryAction: "Voice Briefing",
    sections: [
      {
        id: "brief",
        type: "elder-brief",
        title: "Everything at home looks normal today",
        cards: [
          { icon: "☀", title: "Comfortable weather", detail: "Good for a morning walk, indoor 24°C" },
          { icon: "💊", title: "Blood pressure medicine", detail: "Take at 7:30", tone: "warn" },
          { icon: "🔒", title: "Door lock", detail: "Locked securely", tone: "good" },
        ],
        actions: ["Got it", "Medicine taken"],
      },
      {
        id: "medicine",
        type: "medicine",
        title: "Medicine Reminders",
        items: [
          { title: "Blood pressure medicine", detail: "7:30 after breakfast", tone: "alert" },
          { title: "Calcium tablet", detail: "12:00 after lunch" },
          { title: "Diabetes medicine", detail: "18:00 before dinner" },
        ],
      },
      {
        id: "health",
        type: "metrics",
        title: "Health Overview",
        items: [
          { value: "128/82", label: "Blood pressure normal" },
          { value: "350", label: "Steps, goal 3,000" },
          { value: "24°C", label: "Indoor temperature comfortable" },
          { value: "62kg", label: "Weight stable" },
        ],
      },
      {
        id: "quick-actions",
        type: "quick-actions",
        title: "Quick Actions",
        items: [
          { icon: "💡", title: "Lights", detail: "On" },
          { icon: "❄", title: "Air conditioner", detail: "25°C" },
          { icon: "🔒", title: "Door lock", detail: "Locked", tone: "good" },
          { icon: "👪", title: "Family", detail: "Call" },
          { icon: "🆘", title: "Help", detail: "Emergency call", tone: "danger" },
        ],
      },
    ],
  },
  dad: {
    id: "dad",
    theme: "morning-blue",
    greeting: "Good morning, have a productive workday",
    weather: "☀ Sunny 22°C, light breeze",
    time: "Morning 7:45",
    primaryAction: "Start Departure Prep",
    sections: [
      {
        id: "departure",
        type: "dad-brief",
        title: "Before-You-Leave Overview",
        lines: ["✅ All home devices are running normally", "⚡ Energy use today: 3.2 kWh", "📦 2 packages are waiting at the door"],
        actions: ["Leave Home", "Got it"],
      },
      {
        id: "security",
        type: "security-report",
        title: "Overnight Security Patrol",
        status: "🔒 No issues overnight",
        events: [
          "🌙 22:00 Security mode enabled",
          "🎥 23:15 Living room motion recorded as normal",
          "🌿 01:30 Backyard motion recorded as normal",
          "☀ 06:30 Security mode disabled automatically",
        ],
        trend: "Incidents are down 30% from last week",
      },
      {
        id: "sensors",
        type: "compact-list",
        title: "Sensor Status",
        items: ["🔥 Smoke sensor normal", "💧 Leak sensor normal", "💡 Kitchen light still on", "🚪 Door and window sensors normal", "🌡 Temperature and humidity sensors normal"],
      },
      {
        id: "maintenance",
        type: "maintenance",
        title: "Device Maintenance",
        items: ["🧃 Water purifier filter needs replacement", "🔋 Door lock battery 78%", "🤖 Robot vacuum filter normal", "🍃 Air purifier filter normal"],
        action: "Buy Supplies",
      },
      {
        id: "schedule",
        type: "schedule",
        title: "Family Schedule Today",
        items: ["👦 Xiaoming school 8:00, pickup 15:00", "👩 Mom yoga class 16:00", "👴 Grandpa checkup 10:00", "📦 Package delivery 14:00-16:00"],
      },
      {
        id: "leaving",
        type: "leaving-check",
        title: "Leaving-Home Safety Checklist",
        action: "Run Full Leave-Home Mode",
        items: [
          "💡 Bedroom lights turned off",
          "❄ Living room AC turned off",
          "⚠ Kitchen light still on",
          "🪟 Bedroom window closed",
          "🔒 Door lock secured",
          "🛡 Security mode ready",
        ],
      },
    ],
  },
  mom: {
    id: "mom",
    theme: "evening-dark",
    greeting: "Good evening, time to get dinner ready",
    weather: "🌙 Cloudy 20°C, light breeze",
    time: "Evening 19:30",
    primaryAction: "",
    sections: [
      {
        id: "pet",
        type: "pet-care",
        title: "Pet Care",
        events: ["✅ 7:00 Auto feeding completed", "💧 10:30 Drinking water normal", "🏃 14:00 One backyard activity session", "🐱 16:00 Living room camera recognized the cat"],
        water: "💧 Water dispenser 75%",
        next: "✅ Next feeding 18:00",
        insight: "Activity is 20% lower than usual. Play together for 15 minutes after dinner.",
      },
      {
        id: "elder-care",
        type: "elder-care",
        title: "Grandpa's Activity Rhythm Today",
        summary: "Normal rhythm with a slightly shorter afternoon walk.",
        metrics: [
          { label: "Steps", value: "2,860", detail: "72% of daily goal" },
          { label: "Rest", value: "68 min", detail: "Nap completed" },
          { label: "Hydration", value: "4 cups", detail: "One cup behind" },
        ],
        timeline: [
          { time: "07:00", label: "Wake up", tone: "done" },
          { time: "07:30", label: "Breakfast", tone: "done" },
          { time: "09:20", label: "Morning walk", tone: "done" },
          { time: "13:10", label: "Nap", tone: "done" },
          { time: "16:00", label: "Afternoon walk", tone: "watch" },
        ],
        items: ["Wake up 7:00", "Breakfast 7:30", "Walk 9:00-11:00", "Lunch 12:00", "Nap 13:00-14:00", "TV time 16:00"],
        status: "Routine normal today",
      },
      {
        id: "family",
        type: "family-status",
        title: "Family Status",
        items: ["👦 Xiaoming is doing homework in the bedroom", "👨 Dad is still working late at the office", "👩 Mom is cooking in the kitchen", "👴 Grandpa is watching TV in the living room"],
        action: "Call Xiaoming to Dinner",
      },
      {
        id: "camera",
        type: "camera-events",
        title: "Camera Event Timeline",
        events: ["📦 07:15 Package delivered", "👤 09:30 Grandpa recognized", "🎉 14:22 Highlight replay", "🐾 16:00 Pet activity in the backyard"],
        actions: ["Today Highlights", "Search Events"],
      },
      {
        id: "energy",
        type: "energy",
        title: "Energy Analysis",
        usage: "15.2 kWh",
        cost: "Estimated bill ¥185",
        split: [
          ["Air conditioner", 42],
          ["Water heater", 18],
          ["Refrigerator", 12],
          ["Other", 28],
        ],
      },
      {
        id: "suggestions",
        type: "suggestions",
        title: "Energy-Saving Suggestions",
        items: ["❄️ Set AC to 26°C to save about ¥30/month", "⏱ Avoid laundry during the 18:00-21:00 peak", "🔌 Turn off standby devices to save 0.8 kWh/day"],
        action: "Run Energy-Saving Suggestions",
      },
    ],
  },
};

const momSections = SCENES.mom.sections;
const momElderCareIndex = momSections.findIndex((section) => section.id === "elder-care");
const momPetIndex = momSections.findIndex((section) => section.id === "pet");

if (momElderCareIndex > momPetIndex && momPetIndex >= 0) {
  const [elderCare] = momSections.splice(momElderCareIndex, 1);
  momSections.splice(momPetIndex, 0, elderCare);
}

Object.assign(momSections.find((section) => section.id === "camera"), {
  preview: {
    title: "Living Room Camera",
    caption: "14:22 Baby first steps clip",
    image: "assets/camera-clips/baby-first-steps.png",
    time: "00:18",
  },
});

Object.assign(momSections.find((section) => section.id === "energy"), {
  state: {
    label: "Current Load",
    value: "Medium high",
    peak: "18:00-21:00 peak",
  },
});

Object.assign(momSections.find((section) => section.id === "suggestions"), {
  visual: {
    label: "Estimated Savings",
    value: "¥30/month",
    detail: "AC 26°C + standby shutdown",
  },
});

export function parseRole(search = "") {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const role = params.get("role");
  return SUPPORTED_ROLES.includes(role) ? role : DEFAULT_ROLE;
}

export function getScene(role = DEFAULT_ROLE) {
  return SCENES[SUPPORTED_ROLES.includes(role) ? role : DEFAULT_ROLE];
}
