const cargoList = [
  {
    id: "CARGO001",
    name: "Строительные материалы",
    status: "В пути",
    origin: "Москва",
    destination: "Казань",
    departureDate: "2024-11-24"
  },
  {
    id: "CARGO002",
    name: "Хрупкий груз",
    status: "Ожидает отправки",
    origin: "Санкт-Петербург",
    destination: "Екатеринбург",
    departureDate: "2024-11-26"
  }
];

const statuses = ["Ожидает отправки", "В пути", "Доставлен"];
const tableBody = document.querySelector("#cargoTableBody");
const form = document.querySelector("#addCargoForm");
const filterStatus = document.querySelector("#filterStatus");

// Функция рендера таблицы
function renderTable(filter = "") {
  tableBody.innerHTML = "";
  cargoList
    .filter(cargo => !filter || cargo.status === filter)
    .forEach((cargo, index) => {
      const row = document.createElement("tr");
      row.className = `status-${cargo.status.replace(/\s/g, "-")}`;
      row.innerHTML = `
        <td>${cargo.id}</td>
        <td>${cargo.name}</td>
        <td>
          <select class="form-select" onchange="updateStatus(${index}, this.value)">
            ${statuses
              .map(status => `<option value="${status}" ${cargo.status === status ? "selected" : ""}>${status}</option>`)
              .join("")}
          </select>
        </td>
        <td>${cargo.origin}</td>
        <td>${cargo.destination}</td>
        <td>${cargo.departureDate}</td>
      `;
      tableBody.appendChild(row);
    });
}

// Проверка валидности данных при добавлении
function validateNewCargo(data) {
  if (!data.name || !data.origin || !data.destination || !data.departureDate) {
    alert("Все поля должны быть заполнены.");
    return false;
  }
  return true;
}

// Обновление статуса
function updateStatus(index, newStatus) {
  const cargo = cargoList[index];
  const today = new Date().toISOString().split("T")[0];

  if (newStatus === "Доставлен" && cargo.departureDate > today) {
    alert("Груз не может быть доставлен до даты отправления.");
    renderTable(filterStatus.value); // Перерисовка таблицы
    return;
  }

  cargo.status = newStatus;
  renderTable(filterStatus.value);
}

// Добавление нового груза
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newCargo = {
    id: `CARGO${String(cargoList.length + 1).padStart(3, "0")}`,
    name: document.querySelector("#cargoName").value.trim(),
    origin: document.querySelector("#cargoOrigin").value,
    destination: document.querySelector("#cargoDestination").value,
    departureDate: document.querySelector("#departureDate").value,
    status: "Ожидает отправки"
  };

  if (validateNewCargo(newCargo)) {
    cargoList.push(newCargo);
    form.reset();
    renderTable(filterStatus.value);
  }
});

// Фильтрация по статусу
filterStatus.addEventListener("change", () => {
  renderTable(filterStatus.value);
});

// Инициализация
renderTable();