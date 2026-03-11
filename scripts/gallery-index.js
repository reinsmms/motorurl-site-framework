// scripts/gallery-index.js
// Renders Gallery Index from /assets/index.json
(function(){
  const grid = document.getElementById("subjectGrid");
  const status = document.getElementById("subjectStatus");
  function setStatus(msg){ if(status) status.textContent = msg || ""; }

  async function load(){
    setStatus("Loading…");
    try{
      const res = await fetch("../assets/index.json", { cache: "no-store" });
      if(!res.ok) throw new Error("index missing");
      const data = await res.json();
      const subjects = data.subjects || [];
      if(!subjects.length){
        setStatus("No subjects found yet. Create folders under /assets and run the generator.");
        grid.innerHTML = "";
        return;
      }
      setStatus("");
      grid.innerHTML = "";
      subjects.forEach(s => {
        const a = document.createElement("a");
        a.className = "subjectCard";
        a.href = `gallery.html#g=${encodeURIComponent(s.path)}`;
        a.innerHTML = `<div class="subjectCard__title">${s.name}</div>
                       <div class="subjectCard__meta">${s.path}</div>`;
        grid.appendChild(a);
      });
    } catch(e){
      setStatus("Couldn't load assets/index.json. Run: node scripts/generate-manifests.js");
      grid.innerHTML = "";
    }
  }
  load();
})();
