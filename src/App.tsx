import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Pixel art style CSS
const pixelBorder = "border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
const pixelBorderInset = "border-4 border-black shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.3)]";

function PixelButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "success";
  disabled?: boolean;
}) {
  const variants = {
    primary: "bg-[#5B8C5A] hover:bg-[#4A7349] text-white",
    secondary: "bg-[#FFD93D] hover:bg-[#E6C235] text-black",
    danger: "bg-[#E63946] hover:bg-[#C5313D] text-white",
    success: "bg-[#2EC4B6] hover:bg-[#26A69A] text-black"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${pixelBorder} ${variants[variant]}
        px-3 py-2 md:px-4 md:py-2
        font-bold uppercase tracking-wider text-xs md:text-sm
        transition-all duration-100
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}

function PixelInput({
  value,
  onChange,
  placeholder,
  type = "text",
  name,
  className = ""
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        ${pixelBorderInset}
        bg-[#FFF8E7] text-black
        px-3 py-2 md:px-4 md:py-3
        font-mono text-sm md:text-base
        placeholder:text-gray-500
        focus:outline-none focus:ring-2 focus:ring-[#5B8C5A]
        w-full
        ${className}
      `}
    />
  );
}

function PixelCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`
        w-6 h-6 md:w-8 md:h-8 flex-shrink-0
        ${pixelBorder}
        ${checked ? 'bg-[#5B8C5A]' : 'bg-[#FFF8E7]'}
        flex items-center justify-center
        transition-colors duration-100
      `}
    >
      {checked && (
        <span className="text-white text-base md:text-xl leading-none">✓</span>
      )}
    </button>
  );
}

function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials!" : "Sign up failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2D1B4E] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated pixel stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 md:w-2 md:h-2 bg-yellow-300"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${1 + Math.random() * 2}s infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className={`${pixelBorder} bg-[#8B5CF6] p-4 md:p-8 max-w-md w-full relative`}>
        {/* Title bar */}
        <div className={`${pixelBorder} bg-[#FFD93D] -mt-8 md:-mt-12 mx-4 md:mx-8 mb-4 md:mb-6 px-3 py-2 md:px-4 md:py-2`}>
          <h1 className="text-center font-bold text-lg md:text-2xl text-black tracking-wider">
            PIXEL QUEST
          </h1>
          <p className="text-center text-xs md:text-sm text-black/70">TODO ADVENTURE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-white font-bold text-xs md:text-sm mb-1 md:mb-2 tracking-wider">
              EMAIL:
            </label>
            <PixelInput
              name="email"
              type="email"
              placeholder="hero@quest.com"
            />
          </div>

          <div>
            <label className="block text-white font-bold text-xs md:text-sm mb-1 md:mb-2 tracking-wider">
              PASSWORD:
            </label>
            <PixelInput
              name="password"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <input name="flow" type="hidden" value={flow} />

          {error && (
            <div className={`${pixelBorder} bg-[#E63946] p-2 md:p-3`}>
              <p className="text-white text-xs md:text-sm font-bold text-center">{error}</p>
            </div>
          )}

          <PixelButton
            variant="success"
            className="w-full text-sm md:text-base"
            disabled={loading}
          >
            {loading ? "LOADING..." : flow === "signIn" ? "START GAME" : "CREATE HERO"}
          </PixelButton>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-white/80 hover:text-white text-xs md:text-sm underline"
            >
              {flow === "signIn" ? "New player? Create account" : "Already have an account?"}
            </button>
          </div>
        </form>

        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t-4 border-black/30">
          <PixelButton
            variant="secondary"
            className="w-full text-sm md:text-base"
            onClick={() => signIn("anonymous")}
          >
            PLAY AS GUEST
          </PixelButton>
        </div>

        {/* Decorative pixels */}
        <div className="absolute -bottom-2 -right-2 w-4 h-4 md:w-6 md:h-6 bg-[#E63946] border-2 border-black" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 md:w-6 md:h-6 bg-[#2EC4B6] border-2 border-black" />
      </div>
    </div>
  );
}

function TodoItem({
  todo,
}: {
  todo: {
    _id: Id<"todos">;
    text: string;
    completed: boolean;
    priority?: "low" | "medium" | "high";
  };
}) {
  const toggle = useMutation(api.todos.toggle);
  const remove = useMutation(api.todos.remove);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColors = {
    low: "bg-[#2EC4B6]",
    medium: "bg-[#FFD93D]",
    high: "bg-[#E63946]"
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await remove({ id: todo._id });
  };

  return (
    <div
      className={`
        ${pixelBorder}
        ${todo.completed ? 'bg-[#4A7349]/50' : 'bg-[#FFF8E7]'}
        p-3 md:p-4 flex items-center gap-2 md:gap-4
        transition-all duration-200
        ${isDeleting ? 'opacity-0 scale-95' : ''}
      `}
    >
      <PixelCheckbox
        checked={todo.completed}
        onChange={() => toggle({ id: todo._id })}
      />

      <div className="flex-1 min-w-0">
        <p className={`
          font-mono text-sm md:text-base break-words
          ${todo.completed ? 'line-through text-gray-500' : 'text-black'}
        `}>
          {todo.text}
        </p>
      </div>

      <div className={`
        w-2 h-6 md:w-3 md:h-8 flex-shrink-0
        ${priorityColors[todo.priority || "medium"]}
        border-2 border-black
      `} />

      <button
        onClick={handleDelete}
        className="text-[#E63946] hover:text-[#C5313D] font-bold text-lg md:text-xl px-1 md:px-2 flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
}

function TodoApp() {
  const { signOut } = useAuthActions();
  const todos = useQuery(api.todos.list);
  const stats = useQuery(api.todos.stats);
  const create = useMutation(api.todos.create);
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await create({ text: newTodo.trim(), priority });
    setNewTodo("");
  };

  return (
    <div className="min-h-screen bg-[#1A0F2E] relative overflow-hidden flex flex-col">
      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
        }}
      />

      {/* Pixel grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto p-4 md:p-8 w-full flex-1 flex flex-col">
        {/* Header */}
        <header className="mb-4 md:mb-8">
          <div className={`${pixelBorder} bg-[#8B5CF6] p-4 md:p-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-[#FFD93D] tracking-wider">
                  QUEST LOG
                </h1>
                <p className="text-white/70 text-xs md:text-sm mt-1">Track your daily adventures</p>
              </div>
              <PixelButton variant="danger" onClick={() => signOut()}>
                LOGOUT
              </PixelButton>
            </div>

            {/* Stats bar */}
            {stats && (
              <div className="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:gap-4">
                <div className={`${pixelBorder} bg-[#2EC4B6] p-2 md:p-3 text-center`}>
                  <p className="text-xl md:text-3xl font-bold text-black">{stats.total}</p>
                  <p className="text-[10px] md:text-xs text-black/70 font-bold tracking-wider">TOTAL</p>
                </div>
                <div className={`${pixelBorder} bg-[#5B8C5A] p-2 md:p-3 text-center`}>
                  <p className="text-xl md:text-3xl font-bold text-white">{stats.completed}</p>
                  <p className="text-[10px] md:text-xs text-white/70 font-bold tracking-wider">DONE</p>
                </div>
                <div className={`${pixelBorder} bg-[#E63946] p-2 md:p-3 text-center`}>
                  <p className="text-xl md:text-3xl font-bold text-white">{stats.pending}</p>
                  <p className="text-[10px] md:text-xs text-white/70 font-bold tracking-wider">PENDING</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Add todo form */}
        <form onSubmit={handleSubmit} className="mb-4 md:mb-6">
          <div className={`${pixelBorder} bg-[#4C3A6D] p-3 md:p-4`}>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <div className="flex-1">
                <PixelInput
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Enter new quest..."
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                  className={`
                    ${pixelBorderInset}
                    bg-[#FFF8E7] text-black
                    px-2 py-2 md:px-3 md:py-3
                    font-mono text-xs md:text-sm
                    focus:outline-none
                    cursor-pointer
                    flex-shrink-0
                  `}
                >
                  <option value="low">LOW</option>
                  <option value="medium">MED</option>
                  <option value="high">HIGH</option>
                </select>
                <PixelButton variant="success" className="flex-shrink-0 whitespace-nowrap">
                  + ADD
                </PixelButton>
              </div>
            </div>
          </div>
        </form>

        {/* Todo list */}
        <div className="flex-1 mb-4">
          {todos === undefined ? (
            <div className={`${pixelBorder} bg-[#4C3A6D] p-6 md:p-8 text-center`}>
              <div className="animate-pulse">
                <p className="text-[#FFD93D] font-bold text-lg md:text-xl">LOADING...</p>
                <div className="mt-3 md:mt-4 flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 md:w-4 md:h-4 bg-[#8B5CF6] border-2 border-black"
                      style={{
                        animation: 'bounce 0.6s infinite',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : todos.length === 0 ? (
            <div className={`${pixelBorder} bg-[#4C3A6D] p-6 md:p-8 text-center`}>
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">📜</div>
              <p className="text-white font-bold text-base md:text-lg">NO QUESTS YET!</p>
              <p className="text-white/60 text-xs md:text-sm mt-2">Add your first quest above</p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {todos.map((todo: { _id: Id<"todos">; text: string; completed: boolean; priority?: "low" | "medium" | "high"; }) => (
                <TodoItem key={todo._id} todo={todo} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center pt-4 md:pt-6 border-t border-white/10 mt-auto">
          <p className="text-white/30 text-[10px] md:text-xs font-mono tracking-wider">
            Requested by @PauliusX · Built by @clonkbot
          </p>
        </footer>
      </div>

      {/* Global styles */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A0F2E] flex items-center justify-center">
        <div className={`${pixelBorder} bg-[#8B5CF6] p-6 md:p-8`}>
          <p className="text-[#FFD93D] font-bold text-xl md:text-2xl animate-pulse">
            LOADING GAME...
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-3 h-3 md:w-4 md:h-4 bg-[#FFD93D] border-2 border-black"
                style={{
                  animation: 'bounce 0.6s infinite',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignInForm />;
  }

  return <TodoApp />;
}
