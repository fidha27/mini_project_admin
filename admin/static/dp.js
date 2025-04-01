
function submitDeptForm() {
    let deptName = document.getElementById("deptName").value.trim();
    let deptCode = document.getElementById("deptCode").value.trim();

    if (!deptName || !deptCode) {
        alert("⚠️ Please fill in all fields.");
        return;
    }

    let formData = new FormData();
    formData.append("dept_name", deptName);
    formData.append("dept_code", deptCode);

    fetch("/add_department", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ Department added successfully!");
            document.getElementById("addDepartmentForm").reset(); // Clear form
            location.reload() // Reload department list
        } else {
            alert("! Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error adding department:", error);
        alert("⚠️ An error occurred. Please try again.");
    });
}


function deleteDepartment(departmentId) {
if (!confirm("Are you sure you want to delete this department?")) return;

fetch("/delete_department/" + departmentId, { method: "DELETE" })
.then(response => response.json())
.then(data => {
    if (data.success) {
        let lastSection = localStorage.getItem("lastSection") || "departments"; // Default to departments
        location.reload(); // Reload the page
        setTimeout(() => loadSection(lastSection), 100); // Restore the section after reload
    } else {
        alert("Error: " + data.error);
    }
});
}

function editDepartment(departmentId) {
let newName = prompt("Enter new department name:", document.getElementById("deptName-" + departmentId).innerText);
let newCode = prompt("Enter new department code:", document.getElementById("deptCode-" + departmentId).innerText);

if (!newName || !newCode) return;

fetch("/edit_department/" + departmentId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName, code: newCode })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        let lastSection = localStorage.getItem("lastSection") || "departments"; // Default to departments
        location.reload(); // Reload the page
        setTimeout(() => loadSection(lastSection), 100); // Restore the section after reload
    } else {
        alert("Error: " + data.error);
    }
});
}