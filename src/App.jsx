import React, { useEffect, useMemo, useState } from "react";
import { Search, Copy, Phone, ShieldCheck, Clock3, Filter, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const objections = [
  {
    id: "not-interested",
    title: "I'm not interested",
    keywords: ["i'm not interested", "not interested"],
    category: "Interest",
    acknowledge:
      "I understand (Clients name) deciding on life insurance can be overwhelming and it's natural to take time to consider your options do you agree?",
    check: [
      "Many clients feel the same, but taking even a small step now can provide peace of mind and lock in better rates. With that in mind, (Clients name), have you decided to postpone or do you have a policy in place?",
      "Decided to postpone:",
      "I understand, (Clients name). It's normal to want time to consider your options.",
      "1. Check",
      "The younger and healthier you are, the more affordable life insurance is. Securing a policy now locks in lower premiums and avoids higher costs later.",
      "2. Ask",
      "Wouldn't you agree it's smart to take advantage of this now? Let's do a quick qualification to see your options.",
      "Engage back into script: I'll guide you through the process step by step.",
      "Policy in Place:",
      "I understand, (Clients name). It's great that you've already taken steps to secure a policy.",
      "1. Check",
      "Many clients with existing policies find it beneficial to shop the market. You might save money or improve your coverage with a quick review.",
      "2. Ask",
      "Wouldn't you agree it's worth verifying to see if you qualify for better options? Let's take a moment to check.",
      "Engage back into script: I'll guide you through the process step by step.",
    ],
    ask: [],
    reengage: "",
  },
  {
    id: "already-have-life-insurance",
    title: "I already have life insurance",
    keywords: ["i already have life insurance", "already have life insurance"],
    category: "Existing Coverage",
    acknowledge: "(Clients name). It's great that you've already taken steps to secure a policy.",
    check: [
      "1. Check",
      "Many clients with existing policies find it beneficial to shop the market. You might save money or improve your coverage with a quick review.",
      "2. Ask",
      "Wouldn't you agree it's worth verifying to see if you qualify for better options? Let's take a moment to check.",
    ],
    ask: [],
    reengage: "I'll guide you through the process step by step.",
  },
  {
    id: "expected-online-quote",
    title: "I was expecting an online quote",
    keywords: ["i was expecting an online quote", "online quote", "expecting an online quote"],
    category: "Quote Format",
    acknowledge: "[Client's Name], Many people expect online quotes—it's a common first step.",
    check: [
      "Quotes online often aren't tailored to your specific needs. Speaking directly ensures we get you accurate rates and the right coverage.",
    ],
    ask: ["Wouldn't you agree it's better to have an accurate quote? Let's take a moment to find your best option."],
    reengage: "I'll guide you through the process step by step.",
  },
  {
    id: "call-me-back-busy",
    title: "Call me back Im busy",
    keywords: ["call me back im busy", "call me back", "busy", "i'm busy", "im busy"],
    category: "Time",
    acknowledge: "[Client's Name], I completely understand your time is valuable, and I truly respect that.",
    check: [
      "The good news is this will only take a couple of minutes, and by completing it now, we can determine your eligibility and avoid any delays. Many of my clients appreciate how quick and simple this process is.",
    ],
    ask: ["Wouldn't you agree it's worth just a quick moment to secure this now while we have the opportunity?"],
    reengage: "Let's quickly complete a qualification to see if you're eligible—I promise to be as quick as I can!",
  },
  {
    id: "scam",
    title: "This call seems like a scam",
    keywords: ["this call seems like a scam", "scam"],
    category: "Trust",
    acknowledge: "[Client's Name], I completely understand why you might feel that way. It's smart to be cautious these days.",
    check: [
      "I assure you this is a legitimate call. We are Insurance Supermarket, a licensed and regulated organization. If you'd like, you can verify our credentials directly on the Department of Insurance website for your state. I can provide you with the exact website address or guide you through the process if needed.",
    ],
    ask: ["Does that help reassure you? Let's go ahead and quickly review your options."],
    reengage: "I'll guide you step by step to make this process as smooth and transparent as possible.",
  },
  {
    id: "policy-with-employer",
    title: "I have a policy with my employer",
    keywords: ["i have a policy with my employer", "policy with my employer", "employer"],
    category: "Existing Coverage",
    acknowledge: "I understand, [Client's Name]. It's great that your employer provides coverage—that shows they care about their team.",
    check: [
      "Many clients in similar situations find that employer-provided policies often have limitations. For example, they may not be portable if you change jobs, or the coverage might not be sufficient for your family's long-term needs.",
    ],
    ask: ["Wouldn't you agree it's wise to explore options that supplement your current policy and offer more security? Let's take a quick look at what's available for you."],
    reengage: "I'll guide you through the process step by step to ensure you have the best protection.",
  },
  {
    id: "medical-questions",
    title: "Why do you need to ask me medical questions?",
    keywords: ["why do you need to ask me medical questions", "medical questions"],
    category: "Qualification",
    acknowledge: "I understand, [Client's Name], it might feel personal to discuss medical details. Many people feel the same way at first.",
    check: [
      "The reason we ask is that we're not a guaranteed-issue provider. By gathering this information, we can underwrite your policy, which helps us secure the most cost-effective and tailored coverage for you. This process ensures you're not overpaying for benefits you don't need.",
    ],
    ask: ["Wouldn't you agree it's worth taking a few moments to explore options that save you money and provide the best coverage? Let's move forward with just a few quick questions."],
    reengage: "I'll guide you step by step to ensure this process is simple and beneficial for you.",
  },
  {
    id: "dont-want-transfer",
    title: "I don't want to be transferred",
    keywords: ["i don't want to be transferred", "dont want to be transferred", "transferred"],
    category: "Transfer",
    acknowledge: "I completely understand, [Client's Name]. No one likes feeling passed around, and your time is important.",
    check: [
      "Rather than transferring you, I'll bring in one of our licensed advisors to join us on the call. This way, you can get expert answers and guidance without any interruptions or repeats.",
    ],
    ask: ["Wouldn't you agree it's helpful to have an expert on the line to make sure all your questions are answered thoroughly? Let's make this a smooth process together."],
    reengage: "I'll stay with you every step of the way while the advisor helps ensure you get the best options available.",
  },
  {
    id: "no-one-to-care-about",
    title: "I have no one to care about why do I need Life insurance",
    keywords: ["i have no one to care about why do i need life insurance", "no one to care about"],
    category: "Need",
    acknowledge: "I understand, [Client's Name]. Many people feel life insurance is only for those with dependents.",
    check: [
      "Life insurance can still protect your financial legacy—covering final expenses, paying off debts, or leaving a gift to a cause you care about. It also locks in low rates now, in case your needs change.",
    ],
    ask: ["Wouldn't you agree it's smart to have a plan in place for peace of mind? Let's explore some simple, affordable options."],
    reengage: "I'll guide you step by step to find what works best for you.",
  },
  {
    id: "non-state",
    title: "Why is the call coming back as a non (Clients) State?",
    keywords: ["why is the call coming back as a non state", "non state", "area code"],
    category: "Trust",
    acknowledge: "Thank you for bringing that to my attention, [Client's Name]. I completely understand why you might notice the difference in area code.",
    check: [
      "Our company uses a soft phone system that allows us to make calls from various locations to ensure efficiency and accessibility for all our clients. Despite the area code, I'm here to assist you fully.",
    ],
    ask: ["Wouldn't you agree that having the right assistance is more important than the area code? Let's continue to ensure your needs are met."],
    reengage: "I'll guide you step by step to make sure we address everything you need.",
  },
  {
    id: "dnc",
    title: "Stop calling me, put me on the Do Not Call list (DNC)",
    keywords: ["stop calling me", "do not call", "dnc"],
    category: "Compliance",
    acknowledge: "I understand, [Client's Name], and I apologize for the inconvenience.",
    check: ["I'll add your number to our Do Not Call list right away"],
    ask: [],
    reengage: "Thank you for your time, and have a great day.",
  },
  {
    id: "highest-coverage",
    title: "What is the highest coverage Im eligible for?",
    keywords: ["what is the highest coverage im eligible for", "highest coverage", "max coverage"],
    category: "Coverage",
    acknowledge: "Clients name With Final Expense coverage, these state plans can provide you with a maximum $50,000 worth of coverage. The best part of this is there is no expiration date and designed for people on a limited or fixed income.",
    check: [
      "EMC -Employers Mutual Casualty",
      "Founded in 1911",
      "Rated a+ by AM Best Company and BBB",
      "https://www.emcins.com",
      "City: Des, Moines (Capital City of State Iowa)",
      "(French Name) pronunciation: (Di-Moy-n)",
    ],
    ask: [],
    reengage: "",
  },
  {
    id: "where-calling-from",
    title: "Where are you calling from?",
    keywords: ["where are you calling from", "calling from"],
    category: "Trust",
    acknowledge: "Clients name Our office is located at the Cambridge Innovation Center (On the corner of 20th Ave and 7th St)",
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
    check: [
      "Medicare and Medicaid are federal health insurance programs designed to cover medical costs. However, Final Expense insurance is specifically intended to provide a death benefit to cover funeral, burial, and other end-of-life expenses.",
    ],
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
    ask: ["Wouldn't you agree it's worth taking a brief moment to ensure you're covered properly? Let's get started."],
    reengage: "I'll guide you step by step and make this as efficient as possible.",
  },
  {
    id: "certified",
    title: "Are you Certified",
    keywords: ["are you certified", "certified"],
    category: "Trust",
    acknowledge: "Absolutely, [Client's Name]. That's an important question, and I appreciate you asking.",
    check: ["We are certified, licensed, and work with carriers that are A+ rated by the Better Business Bureau (BBB). You're in trusted hands."],
    ask: [],
    reengage: "I'll guide you step by step to ensure you get the best possible options.",
  },
  {
    id: "no-voicemail",
    title: "Why do you keep calling me without leaving a message",
    keywords: ["why do you keep calling me without leaving a message", "without leaving a message", "voicemail"],
    category: "Trust",
    acknowledge: "I understand how frustrating that can be, [Client's Name], and I truly appreciate your patience.",
    check: ["We don't leave voicemail because we prioritize your confidentiality. It's important to confirm we're speaking directly with you to avoid sharing personal information by accident."],
    ask: [],
    reengage: "I'll guide you step by step to ensure your needs are addressed securely.",
  },
  {
    id: "did-not-request",
    title: "I did not leave a request for life insurance",
    keywords: ["i did not leave a request for life insurance", "did not leave a request"],
    category: "Lead Source",
    acknowledge: "I completely understand, [Client's Name], and I appreciate you taking a moment to speak with me.",
    check: [
      "1. Check & Clarify",
      "I do have your name here as [First Name, Last Name] and your date of birth as [MM-DD-YYYY/]. It's possible that a loved one or spouse inquired on your behalf. Does that sound familiar?",
      "If they say NO:",
      "I understand, [Client's Name]. Our priority is to provide valuable information to individuals who may benefit from this type of coverage. Let me ask—do you currently have a plan in place to ensure your family doesn't have to pay out of pocket for final expenses?",
      "(If they say YES, proceed with a Comparison Approach.)",
      "(If they say NO, handle it as a Not Interested Objection.)",
    ],
    ask: [],
    reengage: "I'd love to take just a moment to go over how this works. I'll guide you step by step to make sure you have the right information for when the time comes. Let's get started...",
  },
];

const categories = ["All", ...Array.from(new Set(objections.map((o) => o.category)))];

function matchesSearch(item, query) {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  const searchableParts = [item.title, ...item.keywords, item.category];
  return searchableParts.some((part) => part.toLowerCase().includes(q));
}

function runSearchTests() {
  const tests = [
    {
      name: 'finds call me back objection when searching "busy"',
      passed: objections.some((item) => item.id === "call-me-back-busy" && matchesSearch(item, "busy")),
    },
    {
      name: 'finds scam objection when searching "sca"',
      passed: objections.some((item) => item.id === "scam" && matchesSearch(item, "sca")),
    },
    {
      name: 'finds medicare objection when searching "medi"',
      passed: objections.some((item) => item.id === "medicare-medicaid" && matchesSearch(item, "medi")),
    },
    {
      name: "all objection ids are unique",
      passed: new Set(objections.map((item) => item.id)).size === objections.length,
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

  const filtered = useMemo(() => {
    return objections.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesCategory && matchesSearch(item, query);
    });
  }, [query, activeCategory]);

  useEffect(() => {
    if (!filtered.length) return;
    if (!filtered.some((item) => item.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || objections[0];

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
          <div className="flex items-end justify-between gap-4">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-200">
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">Calls Experts Objection Handler</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Find any objection in seconds while you're on a live call.</h1>
              <p className="text-sm text-slate-200 md:text-base">Read only the script below: Acknowledge, Check, Ask, and Engage Back into Script.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[560px_minmax(0,1fr)]">
          <div>
            <Card className="rounded-3xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">All objections ({filtered.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Type any word or letter: busy, medicare, scam..."
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
                </div>

                {filtered.length ? (
                  <div className="grid grid-cols-4 gap-2">
                    {filtered.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`w-full min-h-[88px] rounded-2xl border p-3 text-left transition ${
                          selected?.id === item.id ? "border-emerald-500 bg-emerald-50" : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-2">
                            <div className="text-sm font-semibold leading-5 text-slate-900">{item.title}</div>
                            <Badge variant="secondary" className="rounded-full text-[10px]">
                              {item.category}
                            </Badge>
                          </div>
                          <ChevronRight className="mt-1 h-3.5 w-3.5 text-slate-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed p-6 text-sm text-slate-600">No objections matched your search. Clear the search box to see the full list again.</div>
                )}
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
                    <TabsTrigger value="response" className="rounded-2xl">Read on call</TabsTrigger>
                    <TabsTrigger value="keywords" className="rounded-2xl">Search words</TabsTrigger>
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
                        <CardTitle className="text-base">Search words only — never read aloud</CardTitle>
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
