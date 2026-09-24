/**
 * 산책하는펫샵 (inchowon58-beep/sanchack) 전용 배포 가드
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ALLOWED_REMOTE = /github\.com[:/]+inchowon58-beep\/sanchack(\.git)?$/i;
const BLOCKED_REMOTE =
  /dearpet|deatpet|dognme|dogandme|breederclub|blogsite\.co\.kr\/dognme|inchowon58-beep\/dognme|inchowon58-beep\/dearpet/i;
const BLOCKED_VERCEL = /^(dearpet|deatpet|dognme|dogandme)$/i;

function fail(msg) {
  console.error("이 프로젝트는 산책하는펫샵 (sanchack) 전용입니다.");
  console.error("디어펫/도그앤미 저장소·Vercel에는 절대 push/deploy 하지 마세요.\n");
  console.error(msg);
  process.exit(1);
}

const vercelPath = path.join(process.cwd(), ".vercel", "project.json");
if (fs.existsSync(vercelPath)) {
  try {
    const v = JSON.parse(fs.readFileSync(vercelPath, "utf8"));
    if (v?.projectName && BLOCKED_VERCEL.test(v.projectName)) {
      fail(`Vercel 연결이 기존 '${v.projectName}' 입니다. sanchack 전용 프로젝트로 다시 연결하세요.`);
    }
    if (v?.projectName && !/^sanchack$/i.test(v.projectName)) {
      fail(`Vercel 프로젝트 이름은 sanchack 이어야 합니다.\n  현재: ${v.projectName}`);
    }
  } catch {
    /* ignore */
  }
}

let remote = "";
try {
  remote = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
} catch {
  fail("git origin이 없습니다. https://github.com/inchowon58-beep/sanchack.git 로 설정하세요.");
}

if (BLOCKED_REMOTE.test(remote)) {
  fail(`git origin이 기존 저장소입니다:\n  ${remote}`);
}
if (!ALLOWED_REMOTE.test(remote)) {
  fail(
    `git origin은 https://github.com/inchowon58-beep/sanchack.git 이어야 합니다.\n  현재: ${remote}`
  );
}

console.log("✅ 배포 대상 확인: 산책하는펫샵 (sanchack)");
