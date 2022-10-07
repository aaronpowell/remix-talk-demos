(() => {
    document.getElementsByTagName("form")[0].addEventListener("submit", async (e) => {
        e.preventDefault();

        const body = new URLSearchParams();
        body.append("questionId", document.getElementById("questionId").value);
        body.append("answer", document.querySelector("input[name='answer']:checked").value);

        const res = await fetch("Validate.asp", {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const json = await res.json();

        const result = document.querySelector(".result");
        const p = result.querySelector("p");
        p.innerHTML = `You were ${json.correct === "True" ? "correct" : "incorrect"}.`;
        result.classList.remove("hidden");
    });
})();