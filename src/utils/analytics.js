export function computeAnalytics(applications) {
  const total = applications.length;
  const byStatus = {
    Applied: applications.filter((a) => a.status === "Applied").length,
    Interview: applications.filter((a) => a.status === "Interview").length,
    Offer: applications.filter((a) => a.status === "Offer").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const interviewRate =
    total > 0
      ? (((byStatus.Interview + byStatus.Offer) / total) * 100).toFixed(1)
      : 0;
  const offerRate = total > 0 ? ((byStatus.Offer / total) * 100).toFixed(1) : 0;
  const rejectionRate =
    total > 0 ? ((byStatus.Rejected / total) * 100).toFixed(1) : 0;

  // Platform stats
  const platforms = {};
  applications.forEach((a) => {
    if (!platforms[a.platform]) {
      platforms[a.platform] = { total: 0, interview: 0, offer: 0, rejected: 0 };
    }
    platforms[a.platform].total++;
    if (a.status === "Interview") platforms[a.platform].interview++;
    if (a.status === "Offer") platforms[a.platform].offer++;
    if (a.status === "Rejected") platforms[a.platform].rejected++;
  });

  const platformStats = Object.entries(platforms).map(([name, data]) => ({
    name,
    ...data,
    responseRate:
      data.total > 0
        ? (((data.interview + data.offer) / data.total) * 100).toFixed(1)
        : 0,
  }));

  // Company insights
  const companies = {};
  applications.forEach((a) => {
    if (!companies[a.company]) {
      companies[a.company] = {
        total: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
        roles: [],
      };
    }
    companies[a.company].total++;
    if (a.status === "Interview") companies[a.company].interview++;
    if (a.status === "Offer") companies[a.company].offer++;
    if (a.status === "Rejected") companies[a.company].rejected++;
    if (!companies[a.company].roles.includes(a.role))
      companies[a.company].roles.push(a.role);
  });

  const companyInsights = Object.entries(companies)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Response time (days between applied and last updated)
  const responseTimes = applications
    .filter((a) => a.status !== "Applied" && a.dateApplied && a.updatedAt)
    .map((a) => {
      const diff = new Date(a.updatedAt) - new Date(a.dateApplied);
      return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    });

  const avgResponseTime =
    responseTimes.length > 0
      ? (
          responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        ).toFixed(1)
      : null;

  // Weekly stats (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeek = applications.filter(
    (a) => new Date(a.dateApplied) >= weekAgo,
  );
  const weeklyStats = {
    applications: thisWeek.length,
    interviews: thisWeek.filter((a) => a.status === "Interview").length,
    rejections: thisWeek.filter((a) => a.status === "Rejected").length,
    offers: thisWeek.filter((a) => a.status === "Offer").length,
  };

  // Pending follow-ups
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pendingFollowUps = applications.filter((a) => {
    if (!a.followUpDate) return false;
    const followUp = new Date(a.followUpDate);
    followUp.setHours(0, 0, 0, 0);
    return followUp <= today && a.status === "Applied";
  });

  return {
    total,
    byStatus,
    interviewRate,
    offerRate,
    rejectionRate,
    platformStats,
    companyInsights,
    avgResponseTime,
    weeklyStats,
    pendingFollowUps,
  };
}

export function getStatusColor(status) {
  switch (status) {
    case "Applied":
      return "badge-applied";
    case "Interview":
      return "badge-interview";
    case "Offer":
      return "badge-offer";
    case "Rejected":
      return "badge-rejected";
    default:
      return "badge-applied";
  }
}

export function getStatusDot(status) {
  switch (status) {
    case "Applied":
      return "bg-blue-500";
    case "Interview":
      return "bg-amber-500";
    case "Offer":
      return "bg-emerald-500";
    case "Rejected":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
