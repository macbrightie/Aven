export interface DailyReminderData {
  userName?: string;
  dayNumber: number;
  task: string;
  duration: string;
  chainToGoal: string;
  appUrl: string;
}

export interface WelcomeMessageData {
  userName?: string;
  primaryGoal: string;
  appUrl: string;
}

export function buildDailyReminder(data: DailyReminderData): string {
  const name = data.userName ? `Hey ${data.userName}` : 'Hey';
  return [
    `🌅 <b>${name} — Day ${data.dayNumber} of your 100-day challenge</b>`,
    ``,
    `📌 <b>Today's task:</b>`,
    `${data.task}`,
    ``,
    `⏱ <i>${data.duration}</i>`,
    `🎯 <i>Towards: ${data.chainToGoal}</i>`,
    ``,
    `<a href="${data.appUrl}/dashboard">→ Open Aven dashboard</a>`,
  ].join('\n');
}

export function buildWelcomeMessage(data: WelcomeMessageData): string {
  const name = data.userName ? `, ${data.userName}` : '';
  return [
    `✅ <b>You're connected${name}!</b>`,
    ``,
    `Aven will send your daily task reminders here, starting tomorrow morning.`,
    ``,
    `🎯 <b>Your goal:</b> ${data.primaryGoal}`,
    ``,
    `<a href="${data.appUrl}/dashboard">→ Open your dashboard</a>`,
  ].join('\n');
}

export function buildGraceMessage(dayNumber: number, task: string): string {
  return [
    `🟡 <b>Grace day reminder — Day ${dayNumber}</b>`,
    ``,
    `You marked yesterday as a grace day. Today's a new chance.`,
    ``,
    `📌 ${task}`,
    ``,
    `Every day counts. You've got this.`,
  ].join('\n');
}
