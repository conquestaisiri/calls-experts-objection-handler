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
    id: "not-interested",
    title: "I'm not interested",
    keywords: ["i'm not interested", "not interested"],
    category: "Interest",
    acknowledge: "I understand (Clients name) deciding on life insurance can be overwhelming and it’s natural to take time to consider your options do you agree?",
    check: [
      "Many clients feel the same, but taking even a small step now can provide peace of mind and lock in better rates. With that in mind, (Clients name), have you decided to postpone or do you have a policy in place?",
      "Decided to postpone:",
      "I understand, (Clients name). It’s normal to want time to consider your options.",
      "1. Check",
      "The younger and healthier you are, the more affordable life insurance is. Securing a policy now locks in lower premiums and avoids higher costs later.",
      "2. Ask",
      "Wouldn't you agree it’s smart to take advantage of this now? Let’s do a quick qualification to see your options.",
      "Engage back into script: I'll guide you through the process step by step.",
      "Policy in Place:",
      "I understand, (Clients name). It’s great that you’ve already taken steps to secure a policy.",
      "1. Check",
      "Many clients with existing policies find it beneficial to shop the market. You might save money or improve your coverage with a quick review.",
      "2. Ask",
      "Wouldn't you agree it’s worth verifying to see if you qualify for better options? Let’s take a moment to check.",
      "Engage back into script: I'll guide you through the process step by step."
    ],
    ask: [],
    reengage: "",
  },
  {
    id: "already-have-life-insurance",
    title: "I already have life insurance",
    keywords: ["i already have life insurance", "already have life insurance"],
    category: "Existing Coverage",
    acknowledge: "(Clients name). It’s great that you’ve already taken steps to secure a policy.",
    check: [
      "Many clients with existing policies find it beneficial to shop the market.",
      "might save money or improve your coverage with a quick review."
    ],
    ask: ["Wouldn't you agree it’s worth verifying to see if you qualify for better options? Let’s take a moment to check."],
    reengage: "I'll guide you through the process step by step.",
  },
  {
    id: "expected-online-quote",
    title: "I was expecting an online quote",
    keywords: ["i was expecting an online quote", "online quote", "expecting an online quote"],
    category: "Quote Format",
    acknowledge: "",
    check: ["Quotes online often aren’t tailored to your specific needs. Speaking directly ensures we get you accurate rates and the right coverage."],
    ask: ["Wouldn’t you agree it’s better to have an accurate quote? Let’s take a moment to find your best option."],
    reengage: "I'll guide you through the process step by step.",
  },
  {
    id: "current-events",
    title: "current events",
    keywords: ["current events", "busy", "call me back", "please call me back", "i'm busy", "im busy", "not a good time", "time is valuable"],
    category: "Time",
    acknowledge: "[Client's Name], I completely understand your time is valuable, and I truly respect that.",
    check: ["The good news is this will only take a couple of minutes, and by completing it now, we can determine your eligibility and avoid any delays. Many of my clients appreciate how quick and simple this process is."],
    ask: ["Wouldn't you agree it’s worth just a quick moment to secure this now while we have the opportunity?"],
    reengage: "Let’s quickly complete a qualification to see if you’re eligible—I promise to be as quick as I can!",
  },
  {
    id: "scam",
    title: "This call seems like a scam",
    keywords: ["this call seems like a scam", "scam"],
    category: "Trust",
    acknowledge: "[Client's Name], I completely understand why you might feel that way. It’s smart to be cautious these days.",
    check: ["I assure you this is a legitimate call. We are Insurance Supermarket, a licensed and regulated organization. If you'd like, you can verify our credentials directly on the Department of Insurance website for your state. I can provide you with the exact website address or guide you through the process if needed."],
    ask: ["Does that help reassure you? Let’s go ahead and quickly review your options."],
    reengage: "I'll guide you step by step to make this process as smooth and transparent as possible.",
  },
  {
    id: "policy-with-employer",
    title: "I have a policy with my employer",
    keywords: ["i have a policy with my employer", "policy with my employer", "employer"],
    category: "Existing Coverage",
    acknowledge: "I understand, [Client's Name]. It’s great that your employer provides coverage—that shows they care about their team.",
    check: ["Many clients in similar situations find that employer-provided policies often have limitations. For example, they may not be portable if you change jobs, or the coverage might not be sufficient for your family’s long-term needs."],
    ask: ["Wouldn't you agree it’s wise to explore options that supplement your current policy and offer more security? Let’s take a quick look at what’s available for you."],
    reengage: "I'll guide you through the process step by step to ensure you have the best protection.",
  },
  {
    id: "medical-questions",
    title: "Why do you need to ask me medical questions?",
    keywords: ["why do you need to ask me medical questions", "medical questions"],
    category: "Qualification",
    acknowledge: "I understand, [Client's Name], it might feel personal to discuss medical details. Many people feel the same way at first.",
    check: ["The reason we ask is that we’re not a guaranteed-issue provider. By gathering this information, we can underwrite your policy, which helps us secure the most cost-effective and tailored coverage for you. This process ensures you’re not overpaying for benefits you don’t need."],
    ask: ["Wouldn't you agree it’s worth taking a few moments to explore options that save you money and provide the best coverage? Let’s move forward with just a few quick questions."],
    reengage: "I'll guide you step by step to ensure this process is simple and beneficial for you.",
  },
  {
    id: "dont-want-to-be-transferred",
    title: "I don't want to be transferred",
    keywords: ["i don't want to be transferred", "dont want to be transferred", "transferred"],
    category: "Transfer",
    acknowledge: "I completely understand, [Client's Name]. No one likes feeling passed around, and your time is important.",
    check: ["Rather than transferring you, I'll bring in one of our licensed advisors to join us on the call. This way, you can get expert answers and guidance without any interruptions or repeats."],
    ask: ["Wouldn't you agree it’s helpful to have an expert on the line to make sure all your questions are answered thoroughly? Let’s make this a smooth process together."],
    reengage: "I'll stay with you every step of the way while the advisor helps ensure you get the best options available.",
  },
  {
    id: "no-one-to-care-about",
    title: "I have no one to care about why do I need Life insurance",
    keywords: ["i have no one to care about", "why do i need life insurance", "no one to care about"],
    category: "Need",
    acknowledge: "I understand, [Client's Name]. Many people feel life insurance is only for those with dependents.",
    check: ["Life insurance can still protect your financial legacy—covering final expenses, paying off debts, or leaving a gift to a cause you care about. It also locks in low rates now, in case your needs change."],
    ask: ["Wouldn't you agree it’s smart to have a plan in place for peace of mind? Let’s explore some simple, affordable options."],
    reengage: "I'll guide you step by step to find what works best for you.",
  },
  {
    id: "non-state",
    title: "Why is the call coming back as a non State?",
    keywords: ["why is the call coming back as a non state", "non state", "area code"],
    category: "Trust",
    acknowledge: "Thank you for bringing thato my attention, [Client's Name]. I completely understand why you might notice the difference in area code.",
    check: ["Our company uses a soft phone system that allows us to make calls from various locations to ensure efficiency and accessibility for all our clients. Despite the area code, I’m here to assist you fully."],
    ask: ["Wouldn't you agree that having the right assistance is more important than the area code? Let’s continue to ensure your needs are met."],
    reengage: "I'll guide you step by step to make sure we address everything you need.",
  },
  {
    id: "dnc",
    title: "Stop calling me, put me on the Do Not Call list (DNC)",
    keywords: ["do not call", "dnc", "stop calling me"],
    category: "Compliance",
    acknowledge: "I understand, [Client's Name], and I apologize for the inconvenience.",
    check: ["I'll add your number to our Do Not Call list right away."],
    ask: [],
    reengage: "Thank you for your time, and have a great day.",
  },
  {
    id: "highest-coverage",
    title: "What is the highest coverage Im eligible for?",
    keywords: ["what is the highest coverage im eligible for", "highest coverage", "max coverage"],
    category: "Coverage",
    acknowledge: "With Final Expense coverage, these state plans can provide you with a maximum $50,000 worth of coverage.",
    check: [
      "The best part of this is there is no expiration date and designed for people on a limited or fixed income.",
      "Easy Life Highlights:No medical exam, Simplified underwriting, Short form application, Issue ages 18-80 Coverage amounts from $2,000 - $50,000, Guaranteed cash values, level death benefit and level premiums Accelerated Death Benefit and Seat Belt Benefit Riders included at no additional cost in states where approved",
      "Graded Life Highlights: Guaranteed death benefit, cash values and premiums, Coverage amounts from $2,000 - $25,000, Options for the future (surrender cash values or reduced paid-up insurance) Accelerated Death Benefit Rider and Seat Belt Benefit Rider available in states where approved"
    ],
    ask: [],
    reengage: "",
  },
  {
    id: "where-calling-from",
    title: "Where are you calling from?",
    keywords: ["where are you calling from", "calling from"],
    category: "Trust",
    acknowledge: "Our office is located at the Cambridge Innovation Center (On the corner of 20th Ave and 7th St)",
    check: ["1951 NW 7th Avenue #600", "Miami Florida", "Zip code 33136", "Phone number:", "18449401851"],
    ask: [],
    reengage: "",
  },
  {
    id: "medicare-medicaid",
    title: "I have Medicare/ Medicaid, I don't need Final Expense Insurance",
    keywords: ["medicare", "medicaid", "i don't need final expense insurance"],
    category: "Need",
    acknowledge: "I completely understand, [Client's Name]. Many people think Medicare or Medicaid covers everything.",
    check: ["Medicare and Medicaid are federal health insurance programs designed to cover medical costs. However, Final Expense insurance is specifically intended to provide a death benefit to cover funeral, burial, and other end-of-life expenses."],
    ask: ["Do you currently have a policy in place for these costs?"],
    reengage: "",
  },
  {
    id: "how-long",
    title: "How long is this going to take",
    keywords: ["how long is this going to take", "how long", "long"],
    category: "Time",
    acknowledge: "I completely understand, [Client's Name]. Your time is valuable, and I want to respect that.",
    check: ["This process is quick and straightforward. It typically takes just a few minutes to gather the information needed to show you your best options."],
    ask: ["Wouldn't you agree it’s worth taking a brief moment to ensure you’re covered properly? Let’s get started."],
    reengage: "I'll guide you step by step and make this as efficient as possible.",
  },
  {
    id: "certified",
    title: "Are you Certified",
    keywords: ["are you certified", "certified"],
    category: "Trust",
    acknowledge: "Absolutely, [Clients Name]. That's an important question, and I appreciate you asking.",
    check: ["We are certified, licensed, and work with carriers that are A+ rated by the Better Business Bureau (BBB). You’re in trusted hands."],
    ask: [],
    reengage: "I'll guide you step by step to ensure you get the best possible options.",
  },
  {
    id: "no-voicemail",
    title: "Why do you keep calling me without leaving a message",
    keywords: ["why do you keep calling me without leaving a message", "without leaving a message", "voicemail"],
    category: "Trust",
    acknowledge: "I understand how frustrating that can be, [Client's Name], and I truly appreciate your patience.",
    check: ["We don’t leave voicemails because we prioritize your confidentiality. It's important to confirm we’re speaking directly with you to avoid sharing personal information by accident."],
    ask: [],
    reengage: "I'll guide you through the process step by step to ensure your needs are addressed securely.",
  },
  {
    id: "did-not-request",
    title: "I did not leave a request for life insurance",
    keywords: ["i did not leave a request for life insurance", "did not leave a request"],
    category: "Lead Source",
    acknowledge: "I completely understand, [Client's Name], and I appreciate you taking a moment to speak with me.",
    check: [
      "I do have your name here as [First Name, Last Name] and your date of birth as [MM-DD-YYYY/]. It’s possible that a loved one or spouse inquired on your behalf. Does that sound familiar?",
      "If they say NO:",
      "I understand, [Client's Name]. Our priority is to provide valuable information to individuals who may benefit from this type of coverage. Let me ask—do you currently have a plan in place to ensure your family doesn’t have to pay out of pocket for final expenses?",
      "(If they say YES, proceed with a Comparison Approach.)",
      "(If they say NO, handle it as a Not Interested Objection.)"
    ],
    ask: [],
    reengage: "I'd love to take just a moment to go over how this works. I'll guide you step by step to make sure you have the right information for when the time comes. Let’s get started...",
  },
  {
    id: "dont-care-what-happens",
    title: "I don’t care what happens to me",
    keywords: ["i don’t care what happens to me", "just throw me in a ditch", "i'll be dead", "i don’t care about a fancy funeral"],
    category: "Need",
    acknowledge: "When they say this, they are making the mistake of thinking the funeral is for them. It is not. The funeral is for the people left behind.",
    check: [
      "We need to shift the camera angle. Stop letting them picture themselves sleeping in a casket. Start making them picture their daughter or spouse standing at the counter of a funeral home, pulling out a credit card they can't afford to swipe.",
      "The Core Concept: Death = Debt",
      "If a prospect does not have a plan, their death immediately becomes someone else's debt correct? Yes you agree good!",
      "The 3 points you must hit:",
      "1. Legal Reality: You cannot just \"be thrown in a ditch.\" The law requires a proper disposition, and that costs money.",
      "2. The Transfer: If you don't pay it now (pennies), they pay it later (thousands).",
      "3. The Memory: Do you want their last memory of you to be financial stress?",
      "1. The \"It's Not Your Bill\" Reality Check",
      "I understand you don't need anything fancy, (#FirstName#). But here is the hard reality: This bill doesn't come to you. It comes to your daughter/son/spouse on the worst day of their life.",
      "Right now, you have the choice to handle this. If you don't, you are legally forcing that debt onto them. Is that the position you want to leave them in?",
      "2. The \"Last Check You Write\"",
      "You’ve worked hard your whole life to pay your own bills. You’ve been independent. Why would you want the very last bill you ever create to be the one you force someone else to pay?",
      "Let’s make sure you stay independent to the very end, so your passing equals a legacy of love, not a unexpected debt.",
      "3. The \"Grieving vs. Paying\" (The Hard Hitter)",
      "(#FirstName#)., when that day comes, your family is going to be heartbroken. They are going to be grieving.",
      "We want them to be sitting around the living room telling stories about how much they loved you not sitting at the kitchen table arguing over who has $10,000 to pay the funeral home. don't let your memory become a financial burden."
    ],
    ask: [],
    reengage: "",
  }
];

const categories = ["All", ...Array.from(new Set(objections.map((o) => o.category)))]; ["All", ...Array.from(new Set(objections.map((o) => o.category)))];

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
    : [item.title, ...item.keywords, item.category, item.acknowledge, ...item.check, ...item.ask, item.reengage];

  return searchableParts.some((part) => part.toLowerCase().includes(q));
}

function runSearchTests() {
  const tests = [
    {
      name: 'finds current events objection when searching "busy"',
      passed: objections.some((item) => item.id === "current-events" && matchesSearch(item, "busy", { suggestionsOnly: true })),
    },
    {
      name: 'finds exact current events objection when searching "current events"',
      passed: objections.some((item) => item.id === "current-events" && matchesSearch(item, "current events", { suggestionsOnly: true })),
    },
    {
      name: 'finds "How long is this going to take" when searching "long"',
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
      name: 'finds exact not interested objection when searching "interested"',
      passed: objections.some((item) => item.id === "not-interested" && matchesSearch(item, "interested", { suggestionsOnly: true })),
    },
    {
      name: "empty query returns all suggestion candidates",
      passed: objections.every((item) => matchesSearch(item, "", { suggestionsOnly: true })),
    },
    {
      name: "all objection ids are unique",
      passed: new Set(objections.map((item) => item.id)).size === objections.length,
    },
    {
      name: "all objections have acknowledge, check, and reengage",
      passed: objections.every((item) => typeof item.acknowledge === "string" && item.acknowledge.length > 0 && Array.isArray(item.check) && item.check.length > 0 && typeof item.reengage === "string"),
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
    const q = query.toLowerCase().trim();
    const rank = (item) => {
      if (!q) return 0;
      const title = item.title.toLowerCase();
      if (title === q) return 3;
      if (title.startsWith(q)) return 2;
      if (title.includes(q)) return 1;
      return 0;
    };

    return objections
      .filter((item) => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        return matchesCategory && matchesSearch(item, query, { suggestionsOnly: true });
      })
      .sort((a, b) => rank(b) - rank(a) || a.title.localeCompare(b.title));
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
      ...(item.acknowledge ? [`Acknowledge: ${item.acknowledge}`] : []),
      ...item.check.map((line, index) => `Check ${index + 1}: ${line}`),
      ...item.ask.map((line, index) => `Ask ${index + 1}: ${line}`),
      ...(item.reengage ? [`Engage Back into Script: ${item.reengage}`] : []),
    ].join("\n\n");

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
                Built only from the Calls Experts PDF. Read only the sections below: Acknowledge, Check, Ask, and Engage Back into Script.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <Card className="rounded-2xl border-white/10 bg-white/10 text-white shadow-none backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{objections.length}</div>
                  <div className="text-xs text-slate-200">PDF Objections Loaded</div>
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
                    placeholder="Type any word or letter: busy, medicare, scam, bank..."
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
                <CardTitle className="text-lg">Quick suggestions {query.trim() ? `(${quickSuggestions.length})` : ""}</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredSuggestions.length ? (
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
                    </div>
                    <CardTitle className="text-2xl">{selected.title}</CardTitle>
                    <p className="max-w-3xl text-sm font-medium text-red-700">Read only the script below. Do not read the search words aloud.</p>
                  </div>
                  <Button onClick={() => copyText(selected)} className="rounded-2xl">
                    <Copy className="mr-2 h-4 w-4" />
                    {copied === selected.id ? "Copied" : "Copy read-aloud script"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs defaultValue="response" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2 rounded-2xl">
                    <TabsTrigger value="response" className="rounded-2xl">
                      Read on call
                    </TabsTrigger>
                    <TabsTrigger value="keywords" className="rounded-2xl">
                      Search words
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
                          ) : null}
                        </CardContent>
                      </Card>
                    </div>

                    {selected.reengage ? (
                    <Card className="rounded-2xl bg-slate-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Clock3 className="h-4 w-4" /> Engage Back into Script
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-slate-700">{selected.reengage}</CardContent>
                    </Card>
                  ) : null}
                  </TabsContent>

                  <TabsContent value="keywords">
                    <Card className="rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Search words only — do not read aloud</CardTitle>
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
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
