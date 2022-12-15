function changeMarkdown(filename, category) {
  if (filename === "home") {
    document.getElementById(
      "markdown-container"
    ).innerHTML = `<zero-md id="test" src="build/docs/home.md"></zero-md>`;
  } else {
    document.getElementById(
      "markdown-container"
    ).innerHTML = `<zero-md id="test" src="build/docs/${category}/${filename}.md"></zero-md>`;
    /*  document.getElementById(`${filename}`).style.backgroundColor = "white";
    document.getElementById(`get-categories`).style.backgroundColor = "#8cf5ff"; */
  }
}
