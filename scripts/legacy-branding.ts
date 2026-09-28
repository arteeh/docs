/**
 * KubeStellar-era brand scrub shared by the docs sync scripts.
 *
 * The source repos predate the Hive Commons migration and still carry
 * KubeStellar-era identifiers. Rewrite them until the upstream repos are
 * scrubbed, so the published site never shows the old branding. Both
 * scripts/sync-hive-docs.ts and scripts/sync-sibling-docs.ts synced this same
 * rule set independently (byte-for-byte identical up to project-specific
 * extras), which let the two copies drift apart silently; this module is the
 * single source of truth for the shared rules.
 */
export function scrubKubestellarBranding(content: string): string {
  return content
    .replace(/io\.kubestellar\.hive\./g, "io.hivecommons.hive.")
    .replace(/hive\\?\.kubestellar\\?\.io/g, (m) =>
      m.includes("\\") ? "hive\\.hivecommons\\.dev" : "hive.hivecommons.dev")
    .replace(/examples\/kubestellar-fixer\.md/g, "examples/hivecommons-fixer.md")
    .replace(/examples\/kubestellar\//g, "examples/hivecommons/")
    .replace(/@kubestellar\//g, "@hivecommons/")
    .replace(/github\.com\/kubestellar\/hive/g, "github.com/hivecommons/hive")
    .replace(/github\.com\/kubestellar/g, "github.com/hivecommons")
    .replace(/kubestellar\/hive/g, "hivecommons/hive")
    .replace(/kubestellar\/pluk/g, "hivecommons/pluk")
    .replace(/kubestellar\/hotshot/g, "hivecommons/hotshot")
    .replace(/kubestellar\.io/g, "hivecommons.dev")
    .replace(/KubeStellar/g, "Hive Commons")
    .replace(/Kubestellar/g, "Hive Commons")
    .replace(/kubestellar/g, "hivecommons");
}
