import React, { useEffect, useMemo, useState } from "react";
import { Search, Copy, Phone, ShieldCheck, Clock3, Filter, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const objections = [
  {
    id: "angry-multiple-calls",
    title: "You people keep calling me / this is the 10th time today",
    keywords: ["keep calling", "too many calls", "10 times", "spam calls", "stop bothering me"],
    category: "Anger",
    quickSummary: "De-escalate immediately. Apologize, then separate yourself from other callers.",
    acknowledge: "Whoa, I completely understand, that must be really frustrating and I’m sorry about that.",
    check: [
      "I can assure you our system is not designed to call repeatedly like that.",
      "This is actually my first time reaching out to share this information with you.",
      "Once we’re done here, you won’t receive further calls from us."
    ],
    ask: [
      "Since I already have you here, would it make sense to quickly go through this so we can get it handled once and for all?"
    ],
    reengage: "Let’s quickly take care of this so you don’t have to deal with more calls.",
    notes: [
      "Tone is everything here.",
      "Do not argue.",
      "Lower their emotion before moving forward."
    ],
  },
  {
    id: "why-banking-info",
    title: "Why do you need my banking information?",
    keywords: ["banking", "why bank", "is this free", "payment info", "account details"],
    category: "Trust",
    quickSummary: "Reassure that it’s only for eligibility and not required unless they proceed.",
    acknowledge: "That’s a great question, I completely understand why you’d ask that.",
    check: [
      "What we’re offering right now is a free, no-obligation quote.",
      "The banking question is only to confirm eligibility in case you like the plan.",
      "You’re not required to provide any detailed information right now."
    ],
    ask: [
      "It’s just a simple yes or no, would that be okay so we can continue?"
    ],
    reengage: "Let’s continue and keep things simple for you.",
    notes: [
      "Reduce fear of commitment.",
      "Keep it light and non-threatening."
    ],
  },
  {
    id: "who-is-this",
    title: "Who are you / Why are you calling me?",
    keywords: ["who is this", "why calling", "what is this about", "random call"],
    category: "Trust",
    quickSummary: "Clarify quickly and tie back to their inquiry or eligibility.",
    acknowledge: "That’s a fair question, I’d want to know the same.",
    check: [
      "I’m calling from Insurance Supermarket regarding a past inquiry for final expense coverage.",
      "We help find state-approved plans that fit different budgets.",
    ],
    ask: [
      "Do you currently have a plan in place to cover final expenses?"
    ],
    reengage: "Let me quickly walk you through how this works.",
    notes: [
      "This usually happens at the start of calls.",
      "Be confident and clear."
    ],
  },
  {
    id: "send-me-info",
    title: "Just send me the information",
    keywords: ["send me info", "email me", "text me", "i will check later"],
    category: "Avoidance",
    quickSummary: "Avoid losing control. Keep them on the call by explaining value of live process.",
    acknowledge: "I understand, a lot of people prefer that.",
    check: [
      "The reason we go through it together is so you get accurate and personalized options.",
      "Sending generic information may not reflect what you actually qualify for."
    ],
    ask: [
      "Wouldn’t it make more sense to quickly go through this together so you get the right information the first time?"
    ],
    reengage: "Let’s take just a moment to do this properly.",
    notes: [
      "This is a soft brush-off.",
      "Don’t agree too quickly."
    ],
  },
  {
    id: "need-to-think",
    title: "I need to think about it",
    keywords: ["think about it", "later decision", "not sure yet", "decide later"],
    category: "Delay",
    quickSummary: "Bring them back to logic and urgency.",
    acknowledge: "I understand, it’s important to feel confident in your decision.",
    check: [
      "Most people think about it because they don’t have all the information yet.",
      "The sooner you act, the better your rates and eligibility."
    ],
    ask: [
      "Wouldn’t it make sense to at least see what you qualify for now so you can make an informed decision?"
    ],
    reengage: "Let’s just go through this quickly together.",
    notes: [
      "Handle this with logic, not pressure."
    ],
  },
  {
    id: "call-me-back",
    title: "Please call me back",
    keywords: ["call me back", "call later", "not now call later", "schedule call", "busy call back"],
    category: "Time",
    quickSummary: "Do NOT accept easily. Lock the call now or create urgency to continue immediately.",
    acknowledge: "I understand, [Client Name]. I completely get that your schedule might be tight right now.",
    check: [
      "The reason I reached you now is because we already have your information pulled up and ready.",
      "If we delay this, you may lose the current opportunity or have to restart the process.",
      "This only takes a couple of minutes to complete right now."
    ],
    ask: [
      "Wouldn’t it make more sense to just take a quick moment now so we can get this handled without you having to go through this again later?"
    ],
    reengage: "Let’s quickly go through this together, I’ll make it fast and simple for you.",
    notes: [
      "This is NOT a real objection, it’s usually a brush-off.",
      "Do not agree immediately unless absolutely necessary.",
      "Your goal is to keep them on the call."
    ],
  },
  {
    id: "not-interested",
    title: "I'm not interested",
    keywords: ["not interested", "not now", "no interest", "pass", "leave me alone"],
    category: "Interest",
    quickSummary: "Use empathy first, then check whether they postponed or already have coverage.",
    acknowledge: "I understand, [Client Name]. Deciding on life insurance can be overwhelming, and it’s natural to take time to consider your options.",
    check: [
      "If postponed: The younger and healthier you are, the more affordable life insurance is. Securing a policy now locks in lower premiums and avoids higher costs later.",
      "If they already have a policy: Many clients with existing policies find it beneficial to shop the market. You might save money or improve coverage with a quick review.",
    ],
    ask: [
      "If postponed: Wouldn’t you agree it’s smart to take advantage of this now? Let’s do a quick qualification to see your options.",
      "If they already have a policy: Wouldn’t you agree it’s worth verifying to see if you qualify for better options? Let’s take a moment to check.",
    ],
    reengage: "I’ll guide you through the process step by step.",
    notes: [
      "This is described as the most common objection.",
      "Speed matters. Tonality matters. Sound calm, genuine, and concerned.",
      "Be an active listener and build value.",
    ],
  },
  {
    id: "already-have-life-insurance",
    title: "I already have life insurance",
    keywords: ["already have life insurance", "i have insurance", "covered already", "existing policy"],
    category: "Existing Coverage",
    quickSummary: "Do not fight the client. Validate them, then position a review as a smart upgrade check.",
    acknowledge: "I understand, [Client Name]. It’s great that you’ve already taken steps to secure a policy.",
    check: [
      "Many clients with existing policies find it beneficial to shop the market.",
      "A quick review could help save money, improve coverage, or add benefits.",
    ],
    ask: ["Wouldn’t you agree it’s worth verifying to see if you qualify for better options? Let’s take a moment to check."],
    reengage: "I’ll guide you through the process step by step.",
    notes: ["Position it as comparison, not argument.", "Use curiosity and confidence, not hesitation."],
  },
  {
    id: "expected-online",
    title: "I was expecting an online quote",
    keywords: ["online quote", "expected online", "just send quote", "internet quote"],
    category: "Quote Format",
    quickSummary: "Show why live qualification gives a more accurate rate than generic online pricing.",
    acknowledge: "I understand.",
    check: [
      "Quotes online often aren’t tailored to your specific needs.",
      "Speaking directly ensures we get you accurate rates and the right coverage.",
    ],
    ask: ["Wouldn’t you agree it’s better to have an accurate quote? Let’s take a moment to find your best option."],
    reengage: "I’ll guide you through the process step by step.",
    notes: ["Use this when they expected speed or self-service.", "Stress personalization and better fit."],
  },
  {
    id: "current-events-time-valuable",
    title: "My time is valuable / current events / not a good time",
    keywords: ["busy", "not a good time", "time", "current events", "can’t talk", "occupied"],
    category: "Time",
    quickSummary: "Respect their time first, then reduce the task to just a couple of minutes.",
    acknowledge: "[Client Name], I completely understand your time is valuable, and I truly respect that.",
    check: [
      "The good news is this will only take a couple of minutes.",
      "By completing it now, we can determine your eligibility and avoid any delays.",
      "Many clients appreciate how quick and simple the process is.",
    ],
    ask: ["Wouldn’t you agree it’s worth just a quick moment to secure this now while we have the opportunity?"],
    reengage: "Let’s quickly complete a qualification to see if you’re eligible. I promise to be as quick as I can.",
    notes: ["Very useful for time pressure objections.", "Do not sound pushy. Sound efficient."],
  },
  {
    id: "scam",
    title: "This call seems like a scam",
    keywords: ["scam", "fraud", "fake", "not legit", "unsafe"],
    category: "Trust",
    quickSummary: "Agree with their caution, then offer proof and transparency.",
    acknowledge: "[Client Name], I completely understand why you might feel that way. It’s smart to be cautious these days.",
    check: [
      "I assure you this is a legitimate call.",
      "We are Insurance Supermarket, a licensed and regulated organization.",
      "You can verify our credentials on the Department of Insurance website for your state.",
    ],
    ask: ["Does that help reassure you? Let’s go ahead and quickly review your options."],
    reengage: "I’ll guide you step by step to make this process as smooth and transparent as possible.",
    notes: ["Caution is normal. Don’t get defensive.", "Lead with transparency and verification."],
  },
  {
    id: "employer-policy",
    title: "I have a policy with my employer",
    keywords: ["employer", "job policy", "work policy", "group coverage"],
    category: "Existing Coverage",
    quickSummary: "Appreciate it, then point out portability and sufficiency limits.",
    acknowledge: "I understand, [Client Name]. It’s great that your employer provides coverage. That shows they care about their team.",
    check: [
      "Employer-provided policies often have limitations.",
      "They may not be portable if you change jobs.",
      "The coverage may not be enough for your family’s long-term needs.",
    ],
    ask: ["Wouldn’t you agree it’s wise to explore options that supplement your current policy and offer more security? Let’s take a quick look at what’s available for you."],
    reengage: "I’ll guide you through the process step by step to ensure you have the best protection.",
    notes: ["Use this as supplement language, not replacement language."],
  },
  {
    id: "medical-questions",
    title: "Why do you need to ask me medical questions?",
    keywords: ["medical questions", "why medical", "health questions", "personal questions"],
    category: "Qualification",
    quickSummary: "Explain that underwriting helps them qualify for better, more cost-effective coverage.",
    acknowledge: "I understand, [Client Name], it might feel personal to discuss medical details. Many people feel the same way at first.",
    check: [
      "We’re not a guaranteed-issue provider.",
      "By gathering this information, we can underwrite your policy.",
      "That helps secure the most cost-effective and tailored coverage for you.",
      "This helps avoid overpaying for benefits you don’t need.",
    ],
    ask: ["Wouldn’t you agree it’s worth taking a few moments to explore options that save you money and provide the best coverage? Let’s move forward with just a few quick questions."],
    reengage: "I’ll guide you step by step to ensure this process is simple and beneficial for you.",
    notes: ["This objection should feel educational, not defensive."],
  },
  {
    id: "dont-want-transfer",
    title: "I don't want to be transferred",
    keywords: ["don’t transfer me", "no transfer", "stay with you", "passed around"],
    category: "Transfer",
    quickSummary: "Remove the fear of being bounced around. Explain that the advisor joins the same call.",
    acknowledge: "I completely understand, [Client Name]. No one likes feeling passed around, and your time is important.",
    check: [
      "Rather than transferring you, I’ll bring in one of our licensed advisors to join us on the call.",
      "That way you get expert answers and guidance without interruptions or repeats.",
    ],
    ask: ["Wouldn’t you agree it’s helpful to have an expert on the line to make sure all your questions are answered thoroughly? Let’s make this a smooth process together."],
    reengage: "I’ll stay with you every step of the way while the advisor helps ensure you get the best options available.",
    notes: ["Stay reassuring and calm here."],
  },
  {
    id: "no-one-to-care-about",
    title: "I have no one to care about, why do I need life insurance?",
    keywords: ["no one to care about", "no family", "no dependents", "why need insurance"],
    category: "Need",
    quickSummary: "Broaden the reason beyond dependents: debts, final expenses, legacy, causes, future changes.",
    acknowledge: "I understand, [Client Name]. Many people feel life insurance is only for those with dependents.",
    check: [
      "Life insurance can still protect your financial legacy.",
      "It can cover final expenses, pay off debts, or leave a gift to a cause you care about.",
      "It also locks in low rates now in case your needs change later.",
    ],
    ask: ["Wouldn’t you agree it’s smart to have a plan in place for peace of mind? Let’s explore some simple, affordable options."],
    reengage: "I’ll guide you step by step to find what works best for you.",
    notes: ["Shift from family-only framing to personal legacy framing."],
  },
  {
    id: "non-state-area-code",
    title: "Why is the call coming back as a non-state area code?",
    keywords: ["area code", "different state", "non state", "out of state number"],
    category: "Trust",
    quickSummary: "Explain softphone/VoIP systems and redirect back to the purpose of the call.",
    acknowledge: "Thank you for bringing that to my attention, [Client Name]. I completely understand why you might notice the difference in area code.",
    check: [
      "Our company uses a soft phone system that allows us to make calls from various locations.",
      "That helps us ensure efficiency and accessibility for all our clients.",
      "Despite the area code, I’m here to assist you fully.",
    ],
    ask: ["Wouldn’t you agree that having the right assistance is more important than the area code? Let’s continue to ensure your needs are met."],
    reengage: "I’ll guide you step by step to make sure we address everything you need.",
    notes: ["This is a credibility objection, not really a pricing objection."],
  },
  {
    id: "do-not-call",
    title: "Stop calling me, put me on the Do Not Call list (DNC)",
    keywords: ["do not call", "dnc", "stop calling", "remove me"],
    category: "Compliance",
    quickSummary: "Do not rebut. Comply immediately.",
    acknowledge: "I understand, [Client Name], and I apologize for the inconvenience.",
    check: ["I’ll add your number to our Do Not Call list right away."],
    ask: [],
    reengage: "Thank you for your time, and have a great day.",
    notes: ["This should end the call.", "No pressure. No persuasion."],
  },
  {
    id: "highest-coverage",
    title: "What is the highest coverage I’m eligible for?",
    keywords: ["highest coverage", "max coverage", "maximum coverage", "how much coverage"],
    category: "Coverage",
    quickSummary: "Give the range and explain Final Expense vs EasyLife / Graded Whole Life.",
    acknowledge: "With Final Expense coverage, these state plans can provide you with a maximum of $50,000 worth of coverage.",
    check: [
      "The coverage is designed for people on limited or fixed income.",
      "EasyLife Whole Life offers issue ages 18–80 and coverage from $2,000 to $50,000.",
      "Graded Whole Life offers $2,000 to $25,000 with fixed lifetime protection.",
    ],
    ask: ["Would you like me to help determine which amount may fit your needs best?"],
    reengage: "I’ll guide you step by step to see what you may qualify for.",
    notes: ["Useful when the client shifts into curiosity rather than resistance."],
  },
  {
    id: "where-are-you-calling-from",
    title: "Where are you calling from?",
    keywords: ["where are you calling from", "location", "office address", "where is your office"],
    category: "Trust",
    quickSummary: "Give the office location clearly and confidently.",
    acknowledge: "Our office is located at the Cambridge Innovation Center.",
    check: ["1951 NW 7th Avenue #600, Miami, Florida 33136.", "Phone number: 18449401851."],
    ask: ["Now that you know where we’re calling from, let’s quickly go over your options."],
    reengage: "I’ll guide you through the next steps clearly.",
    notes: ["Use this for trust-building and transparency."],
  },
  {
    id: "medicare-medicaid",
    title: "I have Medicare/Medicaid, I don't need Final Expense Insurance",
    keywords: ["medicare", "medicaid", "government covers it", "i don’t need final expense"],
    category: "Need",
    quickSummary: "Separate medical coverage from funeral and end-of-life expense coverage.",
    acknowledge: "I completely understand, [Client Name]. Many people think Medicare or Medicaid covers everything.",
    check: [
      "Medicare and Medicaid are designed to cover medical costs.",
      "Final Expense insurance is specifically intended to provide a death benefit for funeral, burial, and other end-of-life expenses.",
    ],
    ask: ["Do you currently have a policy in place for these costs?"],
    reengage: "Let’s quickly see what options may be available for you.",
    notes: ["Keep the distinction simple and direct."],
  },
  {
    id: "how-long",
    title: "How long is this going to take?",
    keywords: ["how long", "how much time", "duration", "quick"],
    category: "Time",
    quickSummary: "Respect time, promise efficiency, then move forward immediately.",
    acknowledge: "I completely understand, [Client Name]. Your time is valuable, and I want to respect that.",
    check: [
      "This process is quick and straightforward.",
      "It typically takes just a few minutes to gather the information needed to show you your best options.",
    ],
    ask: ["Wouldn’t you agree it’s worth taking a brief moment to ensure you’re covered properly? Let’s get started."],
    reengage: "I’ll guide you step by step and make this as efficient as possible.",
    notes: ["Very similar to the busy/time objection, but even shorter."],
  },
  {
    id: "certified",
    title: "Are you certified?",
    keywords: ["certified", "licensed", "qualified", "bbb", "trusted"],
    category: "Trust",
    quickSummary: "Answer directly and confidently. This is a reassurance moment.",
    acknowledge: "Absolutely, [Client Name]. That’s an important question, and I appreciate you asking.",
    check: [
      "We are certified, licensed, and work with carriers that are A+ rated by the Better Business Bureau (BBB).",
      "You’re in trusted hands.",
    ],
    ask: [],
    reengage: "I’ll guide you step by step to ensure you get the best possible options.",
    notes: ["Use nurturing tonality here."],
  },
  {
    id: "no-voicemail",
    title: "Why do you keep calling me without leaving a message?",
    keywords: ["no voicemail", "why no message", "keep calling"],
    category: "Trust",
    quickSummary: "Tie the reason to confidentiality and security.",
    acknowledge: "I understand how frustrating that can be, [Client Name], and I truly appreciate your patience.",
    check: [
      "We don’t leave voicemails because we prioritize your confidentiality.",
      "It’s important to confirm we’re speaking directly with you to avoid sharing personal information by accident.",
    ],
    ask: [],
    reengage: "I’ll guide you through the process step by step to ensure your needs are addressed securely.",
    notes: ["Best delivered in a calm, respectful tone."],
  },
  {
    id: "did-not-request",
    title: "I did not leave a request for life insurance",
    keywords: ["did not request", "didn’t fill anything", "never asked", "not me"],
    category: "Lead Source",
    quickSummary: "Clarify calmly, then pivot based on whether they do or don’t have existing coverage.",
    acknowledge: "I completely understand, [Client Name], and I appreciate you taking a moment to speak with me.",
    check: [
      "I do have your name here as [First Name, Last Name] and your date of birth as [MM-DD-YYYY].",
      "It’s possible that a loved one or spouse inquired on your behalf. Does that sound familiar?",
      "If they say no: Our priority is to provide valuable information to individuals who may benefit from this type of coverage.",
    ],
    ask: ["Do you currently have a plan in place to ensure your family doesn’t have to pay out of pocket for final expenses?"],
    reengage: "I’d love to take just a moment to go over how this works. I’ll guide you step by step to make sure you have the right information for when the time comes.",
    notes: ["If yes, use comparison approach.", "If no, handle it like a not interested objection."],
  },
];

const categories = ["All", ...Array.from(new Set(objections.map((o) => o.category)))];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text, query) {
  if (!query.trim()) return text;
  const safeQuery = escapeRegExp(query.trim());
  const parts = text.split(new RegExp(`(${safeQuery})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === query.trim().toLowerCase() ? (
      <mark key={`${part}-${index}`} className="rounded px-1">
        {part}
      </mark>
    ) : (
      <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    ),
  );
}

function matchesSearch(item, query, options = { suggestionsOnly: false }) {
  const q = query.toLowerCase().trim();
  if (!q) return true;

  const searchableParts = options.suggestionsOnly
    ? [item.title, ...item.keywords, item.category]
    : [
        item.title,
        item.quickSummary,
        ...item.keywords,
        item.category,
        item.acknowledge,
        ...item.check,
        ...item.ask,
        item.reengage,
        ...item.notes,
      ];

  return searchableParts.some((part) => part.toLowerCase().includes(q));
}

function runSearchTests() {
  const tests = [
    {
      name: 'finds call back objection when searching "call back"',
      passed: objections.some((item) => item.id === "call-me-back" && matchesSearch(item, "call back", { suggestionsOnly: true })),
    },
    {
      name: 'finds "How long is this going to take?" when searching "long"',
      passed: objections.some((item) => item.id === "how-long" && matchesSearch(item, "long", { suggestionsOnly: true })),
    },
    {
      name: 'finds scam objection when searching "sca"',
      passed: objections.some((item) => item.id === "scam" && matchesSearch(item, "sca", { suggestionsOnly: true })),
    },
    {
      name: 'finds Medicare objection when searching "medi"',
      passed: objections.some((item) => item.id === "medicare-medicaid" && matchesSearch(item, "medi", { suggestionsOnly: true })),
    },
    {
      name: "empty query returns all suggestion candidates",
      passed: objections.every((item) => matchesSearch(item, "", { suggestionsOnly: true })),
    },
  ];

  const failed = tests.filter((test) => !test.passed);
  if (failed.length) {
    console.error("Search tests failed:", failed);
  }
}

export default function CallsExpertsObjectionHandler() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(objections[0].id);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    runSearchTests();
  }, []);

  const filteredSuggestions = useMemo(() => {
    return objections.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesCategory && matchesSearch(item, query, { suggestionsOnly: true });
    });
  }, [query, activeCategory]);

  const filtered = useMemo(() => {
    return objections.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesCategory && matchesSearch(item, query);
    });
  }, [query, activeCategory]);

  useEffect(() => {
    if (!filtered.length) return;

    const selectedStillVisible = filtered.some((item) => item.id === selectedId);
    if (!selectedStillVisible) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || objections[0];

  const quickSuggestions = useMemo(() => filteredSuggestions.map((item) => item.title), [filteredSuggestions]);

  const copyText = async (item) => {
    const full = [
      item.title,
      "",
      `Acknowledge: ${item.acknowledge}`,
      "",
      ...item.check.map((line, index) => `Check ${index + 1}: ${line}`),
      "",
      ...(item.ask.length ? item.ask.map((line, index) => `Ask ${index + 1}: ${line}`) : ["Ask: No follow-up ask here."]),
      "",
      `Re-engage: ${item.reengage}`,
      "",
      "Notes:",
      ...item.notes.map((note) => `- ${note}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(full);
      setCopied(item.id);
      window.setTimeout(() => setCopied(""), 1500);
    } catch (error) {
      console.error("Failed to copy objection text:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-200">
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">Calls Experts Objection Handler</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Find any objection in seconds while you’re on a live call.</h1>
              <p className="text-sm text-slate-200 md:text-base">
                Built for fast call handling. Search by exact objection, common wording, or just tap a suggestion and jump straight to the response.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <Card className="rounded-2xl border-white/10 bg-white/10 text-white shadow-none backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{objections.length}</div>
                  <div className="text-xs text-slate-200">Objections Loaded</div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-white/10 bg-white/10 text-white shadow-none backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{categories.length - 1}</div>
                  <div className="text-xs text-slate-200">Categories</div>
                </CardContent>
              </Card>

              <Card className="col-span-2 rounded-2xl border-white/10 bg-white/10 text-white shadow-none backdrop-blur md:col-span-1">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">ACA</div>
                  <div className="text-xs text-slate-200">Acknowledge • Check • Ask</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5" />
                  Search objections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type any word or letter: long, scam, medi, time..."
                    className="rounded-2xl pl-10"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Filter className="h-4 w-4" />
                    Filter by category
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        type="button"
                        variant={activeCategory === category ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Quick suggestions {query.trim() ? `(${quickSuggestions.length})` : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quickSuggestions.length ? (
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setQuery(item);
                          const found = objections.find((objection) => objection.title === item);
                          if (found) setSelectedId(found.id);
                        }}
                        className="rounded-full border bg-white px-3 py-2 text-left text-sm hover:bg-slate-50"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed p-4 text-sm text-slate-600">
                    No suggestion matches <span className="font-medium">“{query}”</span> yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Matching objections</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[420px] px-4 pb-4">
                  <div className="space-y-2 pt-1">
                    {filtered.length ? (
                      filtered.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            selected?.id === item.id ? "border-emerald-500 bg-emerald-50" : "bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2">
                              <div className="font-semibold text-slate-900">{highlight(item.title, query)}</div>
                              <div className="text-sm text-slate-600">{highlight(item.quickSummary, query)}</div>
                              <Badge variant="secondary" className="rounded-full">
                                {item.category}
                              </Badge>
                            </div>
                            <ChevronRight className="mt-1 h-4 w-4 text-slate-400" />
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed p-6 text-sm text-slate-600">
                        No objections matched your search. Try another phrase like <span className="font-medium">busy</span>, <span className="font-medium">scam</span>, or <span className="font-medium">Medicare</span>.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader className="border-b pb-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full bg-emerald-700 hover:bg-emerald-700">{selected.category}</Badge>
                      <Badge variant="outline" className="rounded-full">
                        Live-call ready
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{selected.title}</CardTitle>
                    <p className="max-w-3xl text-sm text-slate-600">{selected.quickSummary}</p>
                  </div>
                  <Button onClick={() => copyText(selected)} className="rounded-2xl">
                    <Copy className="mr-2 h-4 w-4" />
                    {copied === selected.id ? "Copied" : "Copy full response"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs defaultValue="response" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl">
                    <TabsTrigger value="response" className="rounded-2xl">
                      Response
                    </TabsTrigger>
                    <TabsTrigger value="keywords" className="rounded-2xl">
                      Trigger words
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-2xl">
                      Coaching notes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="response" className="space-y-4">
                    <div className="grid gap-4 xl:grid-cols-3">
                      <Card className="rounded-2xl border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <ShieldCheck className="h-4 w-4" /> Acknowledge
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-700">{selected.acknowledge}</CardContent>
                      </Card>

                      <Card className="rounded-2xl border-l-4 border-l-amber-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Check</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-700">
                          <ul className="list-disc space-y-2 pl-5">
                            {selected.check.map((line, index) => (
                              <li key={`${selected.id}-check-${index}`}>{line}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl border-l-4 border-l-emerald-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Ask</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-700">
                          {selected.ask.length ? (
                            <ul className="list-disc space-y-2 pl-5">
                              {selected.ask.map((line, index) => (
                                <li key={`${selected.id}-ask-${index}`}>{line}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>No follow-up ask here. This one is mostly about confirmation or compliance.</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="rounded-2xl bg-slate-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Clock3 className="h-4 w-4" /> Re-engage back into script
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-slate-700">{selected.reengage}</CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="keywords">
                    <Card className="rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Common trigger words and phrases</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selected.keywords.map((word) => (
                            <Badge key={`${selected.id}-${word}`} variant="secondary" className="rounded-full px-3 py-1">
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notes">
                    <Card className="rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Coaching notes</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-slate-700">
                        <ul className="list-disc space-y-2 pl-5">
                          {selected.notes.map((note, index) => (
                            <li key={`${selected.id}-note-${index}`}>{note}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">How this website should behave in the real build</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>1. Every objection should appear as a search suggestion the moment you tap into the search box.</p>
                <p>2. Typing any matching letter or word should instantly narrow the suggestions list.</p>
                <p>3. Clicking any suggestion should instantly open the exact objection card with no extra loading.</p>
                <p>4. Search should match both the objection title and alternate wording the client may actually say on a call.</p>
                <p>
                  5. The website should keep responses in the same structure every time: <span className="font-semibold">Acknowledge → Check → Ask → Re-engage</span>.
                </p>
                <p>6. There should be a one-tap copy button because on live calls speed matters more than beauty.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
