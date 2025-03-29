document.addEventListener("DOMContentLoaded", function () {
    // Handle adding a department
    document.getElementById("addDepartmentForm")?.addEventListener("submit", function (event) {
        event.preventDefault();
        let deptName = document.getElementById("dept_name").value;
        let deptCode = document.getElementById("dept_code").value;
        
        fetch("/add_department", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dept_name: deptName, dept_code: deptCode })
        }).then(response => response.json())
          .then(data => {
              alert(data.message);
              if (data.success) location.reload();
          });
    });

    // Handle deleting a department
    document.querySelectorAll(".delete-department").forEach(button => {
        button.addEventListener("click", function () {
            let deptCode = this.getAttribute("data-code");
            
            fetch(`/delete_department/${deptCode}`, { method: "DELETE" })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.success) location.reload();
                });
        });
    });

    // Handle adding a faculty
    document.getElementById("addFacultyForm")?.addEventListener("submit", function (event) {
        event.preventDefault();
        let facultyName = document.getElementById("faculty_name").value;
        let penNo = document.getElementById("pen_no").value;
        let deptCode = document.getElementById("faculty_dept").value;

        fetch("/add_faculty", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: facultyName, pen_no: penNo, dept_code: deptCode })
        }).then(response => response.json())
          .then(data => {
              alert(data.message);
              if (data.success) location.reload();
          });
    });

    // Handle assigning a HoD
    document.getElementById("assignHodForm")?.addEventListener("submit", function (event) {
        event.preventDefault();
        let facultyId = document.getElementById("hod_faculty").value;
        let deptCode = document.getElementById("hod_dept").value;

        fetch("/assign_hod", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ faculty_id: facultyId, dept_code: deptCode })
        }).then(response => response.json())
          .then(data => {
              alert(data.message);
              if (data.success) location.reload();
          });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Load section dynamically
    $(".sidebar ul li").on("click", function () {
        let section = $(this).data("section");
        loadSection(section);
    });

    function loadSection(section) {
        $.ajax({
            url: `/${section}`,
            success: function (data) {
                $("#main-content").html(data);
            },
            error: function () {
                $("#main-content").html("<h2>Failed to load section</h2>");
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".sidebar ul li").forEach(item => {
        item.addEventListener("click", function () {
            let section = this.getAttribute("data-section");

            fetch("/" + section, { headers: { "X-Requested-With": "XMLHttpRequest" } })
                .then(response => response.text())
                .then(data => {
                    document.getElementById("main-content").innerHTML = data;
                })
                .catch(error => {
                    console.error("Error loading section:", error);
                    document.getElementById("main-content").innerHTML = "<h2>Failed to load section</h2>";
                });
        });
    });
});

