import { Search, Monitor, User, Lock, MessageSquare, Video, Bell, Keyboard, HelpCircle, LogOut } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

const settingsItems = [
  { id: "general", label: "General", desc: "Startup and close", icon: Monitor },
  { id: "account", label: "Account", desc: "Security notifications, account info", icon: User },
  { id: "privacy", label: "Privacy", desc: "Blocked contacts, disappearing messages", icon: Lock },
  { id: "chats", label: "Chats", desc: "Theme, wallpaper, chat settings", icon: MessageSquare },
  { id: "video", label: "Video & voice", desc: "Camera, microphone & speakers", icon: Video },
  { id: "notifications", label: "Notifications", desc: "Message notifications", icon: Bell },
  { id: "shortcuts", label: "Keyboard shortcuts", desc: "Quick actions", icon: Keyboard },
  { id: "help", label: "Help and feedback", desc: "Help centre, contact us, privacy policy", icon: HelpCircle },
];

export default function SettingsSidebar() {
  const { theme } = useTheme(); 

  const isDark = theme === "dark";

  return (
    <aside
      className={`h-screen w-full max-w-sm px-4 py-5 border-r transition-colors duration-300
        ${isDark ? "bg-zinc-900 text-zinc-100 border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"}`}
    >
      <h1 className="text-xl font-semibold mb-4">Settings</h1>

      {/* Search */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-6 border
        ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-200"}`}
      >
        <Search size={18} className="opacity-70" />
        <input
          type="text"
          placeholder="Search settings"
          className={`w-full bg-transparent outline-none text-sm
            ${isDark ? "placeholder-zinc-400" : "placeholder-gray-500"}`}
        />
      </div>
      {/* Profile */}
      <div className="flex items-center gap-3 mb-6">
        <Image
          src="/avatar.png"
          alt="Profile"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-medium">PRAKASH SUTHAR</p>
          <p className="text-sm opacity-70">Hey there! I am using WhatsApp.</p>
        </div>
      </div>

      {/* Settings list */}
      <nav className="space-y-1">
        {settingsItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-start gap-4 px-3 py-3 rounded-lg text-left transition-colors
              ${isDark
                ? "hover:bg-zinc-800"
                : "hover:bg-gray-100"}`}
          >
            <item.icon size={20} className="mt-1 opacity-80" />
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="text-sm opacity-70">{item.desc}</p>
            </div>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button
        className="mt-6 flex items-center gap-3 text-red-500 px-3 py-2 rounded-lg hover:bg-red-500/10"
      >
        <LogOut size={20} />
        <span className="font-medium">Log out</span>
      </button>
    </aside>
  );
}
