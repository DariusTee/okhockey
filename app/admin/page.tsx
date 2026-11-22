import { headers } from "next/headers";
import { catalog, db, isEditor, prune } from "../../lib/store";
import { requireChatGPTUser } from "../chatgpt-auth";
import { Editor, type Entry } from "../../components/Editor";
import { Intro } from "../../components/Editorial";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Redaktion",
  robots: { index: false, follow: false },
};
export default async function Page() {
  await requireChatGPTUser("/admin");
  if (!(await isEditor(await headers())))
    return (
      <div className="wrap page">
        <h1>Redaktionszugang erforderlich</h1>
        <p>Dieses Konto hat keine Berechtigung zur Inhaltsverwaltung.</p>
      </div>
    );
  await prune();
  const entries = await db()
    .prepare(
      "SELECT id,name,email,subject,description,url,created FROM submissions ORDER BY created DESC",
    )
    .all<Entry>();
  return (
    <div className="wrap page">
      <Intro kicker="Inhaltsverwaltung" first="OKHockey" last="Redaktion." />
      <Editor items={await catalog(true)} entries={entries.results} />
    </div>
  );
}
