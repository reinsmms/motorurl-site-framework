import sys, pathlib, re
try:
    import markdown
    HAVE_MD = True
except Exception:
    HAVE_MD = False

src_docs = pathlib.Path(sys.argv[1]).resolve()
dst_root = pathlib.Path(sys.argv[2]).resolve()

HTML_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <link rel="stylesheet" href="/css/styles.css" />
  <link rel="stylesheet" href="/css/toc.css" />
</head>
<body>
  <main class="page">
  {body}
  </main>
</body>
</html>
"""

def title_from_md(text, fallback):
    m = re.search(r'(?m)^\s*#\s+(.+?)\s*$', text)
    return (m.group(1).strip() if m else fallback)

def fallback_convert(md_text):
    # very plain fallback: paragraphs + fenced code
    lines = md_text.splitlines()
    out, in_code = [], False
    for ln in lines:
        if ln.strip().startswith("```"):
            in_code = not in_code
            out.append("<pre><code>" if in_code else "</code></pre>")
            continue
        if in_code:
            out.append(ln.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;"))
        else:
            if ln.strip() == "":
                out.append("")
            else:
                out.append(f"<p>{ln}</p>")
    return "\n".join(out)

def convert(md_text):
    if HAVE_MD:
        return markdown.markdown(md_text, extensions=["extra", "tables"])
    return fallback_convert(md_text)

for md_file in src_docs.rglob("*.md"):
    rel = md_file.relative_to(src_docs)
    out_file = dst_root / rel.with_suffix(".html")
    out_file.parent.mkdir(parents=True, exist_ok=True)
    text = md_file.read_text(encoding="utf-8", errors="replace")
    title = title_from_md(text, md_file.stem)
    body = convert(text)
    out_file.write_text(HTML_TEMPLATE.format(title=title, body=body), encoding="utf-8")

print("OK:", "markdown" if HAVE_MD else "fallback", "->", str(dst_root))
