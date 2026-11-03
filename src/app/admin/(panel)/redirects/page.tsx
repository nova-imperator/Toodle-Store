import { requireAdmin } from "@/server/auth/admin";
import { listRedirects } from "@/server/services/redirects";
import { RedirectForm } from "@/components/admin/RedirectForm";
import { deleteRedirectAction } from "../actions";
import styles from "../../admin.module.css";

export const metadata = { title: "Redirects" };

export default async function RedirectsPage() {
  await requireAdmin("content");
  const redirects = await listRedirects();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Redirects (301)</h1>
          <p className={styles.sub}>Send old WordPress links to their new pages so Google rankings carry over.</p>
        </div>
      </div>
      <div className={styles.cols}>
        <div className={styles.tableWrap}>
          {redirects.length === 0 ? (
            <p className={styles.empty}>No redirects yet. Add the old URLs from the WordPress sitemap.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr><th>Old URL</th><th>New URL</th><th /></tr>
              </thead>
              <tbody>
                {redirects.map((r) => (
                  <tr key={r.oldUrl}>
                    <td className={styles.wrap}>{r.oldUrl}</td>
                    <td className={styles.wrap}><a href={r.newUrl} target="_blank" rel="noopener">{r.newUrl}</a></td>
                    <td>
                      <form action={deleteRedirectAction.bind(null, r.oldUrl)}>
                        <button type="submit" className={styles.pill} data-tone="red">Remove</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <section className={styles.panel}>
          <h2>Add redirect</h2>
          <RedirectForm />
        </section>
      </div>
    </>
  );
}
