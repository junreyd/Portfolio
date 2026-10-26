export const codeStories = [
  {
    result: 'Built to make work simpler.',
    code: `const work = {
  connected: true,
  automated: true
};

function buildImpact(work) {
  if (work.connected && work.automated) {
    return "Built to make work simpler.";
  }
}

console.log(buildImpact(work));`,
  },
  {
    result: 'Less admin. More meaningful work.',
    code: `const tasks = ["report", "approve"];
const repetitive = true;

const giveTimeBack = tasks =>
  tasks.map(task => ({
    task, automated: repetitive
  }));

const workflow = giveTimeBack(tasks);
if (workflow.every(job => job.automated))
  console.log(
    "Less admin. More meaningful work.");`,
  },
  {
    result: 'Connected teams. Clearer decisions.',
    code: `const teams = ["People", "Operations"];
const connected = teams.length > 1;

function bringTogether(teams) {
  return teams.join(" + ");
}
const workspace = bringTogether(teams);
if (connected && workspace.length) {
  console.log(
    "Connected teams. Clearer decisions."
  );
}`,
  },
  {
    result: 'Turn routine work into progress.',
    code: `const process = {
  manualSteps: 5,
  automatedSteps: 5
};
const simplify = process =>
  process.manualSteps ===
    process.automatedSteps;

if (simplify(process)) {
  console.log(
    "Turn routine work into progress.");
}`,
  },
  {
    result: 'Better systems. More room for ideas.',
    code: `const systems = ["SharePoint", "Apps"];
const improve = systems => ({
  connected: systems.length > 1,
  timeForIdeas: true
});

const business = improve(systems);
if (business.connected) {
  console.log(
    "Better systems. More room for ideas."
  );
}`,
  },
]

export const workflowTechnologies = [
  { name: 'SharePoint', icon: 'layers', position: 'sharepoint', angle: -5 },
  { name: 'Power Platform', icon: 'zap', position: 'power', angle: 5 },
  { name: 'Microsoft 365', icon: 'blocks', position: 'microsoft', angle: -2 },
  { name: 'SPFx', icon: 'code', position: 'spfx', angle: -7 },
  { name: 'Microsoft Graph', icon: 'network', position: 'graph', angle: 4 },
  { name: 'React & TypeScript', icon: 'braces', position: 'react', angle: 4 },
  { name: 'Dataverse', icon: 'database', position: 'dataverse', angle: -4 },
  { name: 'REST APIs', icon: 'cable', position: 'api', angle: 3 },
] as const

// Fixed positions keep the star field stable between renders and across themes.
export const universeStars = Array.from({ length: 30 }, (_, index) => ({
  x: 4 + ((index * 37 + 13) % 92),
  y: 3 + ((index * 53 + 29) % 92),
  size: index % 5 === 0 ? 2.5 : 1.5,
  opacity: 0.2 + (index % 4) * 0.12,
}))
