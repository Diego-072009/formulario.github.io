// ------ LOCALSTORAGE ------
const campos = [
    "fecha_registro","primer_nombre","segundo_nombre","primer_apellido","segundo_apellido",
    "identificacion","lugar_nacimiento","nacionalidad","sexo","edad","estado_civil",
    "direccion","telefono_habitacion","telefono_movil",
    "nombre_padre","edad_padre","nombre_madre","edad_madre","conyuge"
];

function guardarCampo(id) {
    localStorage.setItem("formRH_" + id, document.getElementById(id).value);
}
function cargarCampos() {
    campos.forEach(id => {
        if(localStorage.getItem("formRH_" + id)) {
            document.getElementById(id).value = localStorage.getItem("formRH_" + id);
        }
    });
}
campos.forEach(id => {
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById(id).addEventListener("input", ()=>guardarCampo(id));
    });
});

function guardarHijos() {
    const hijos = [];
    document.querySelectorAll("#hijos_tabla tr:not(:first-child)").forEach(tr => {
        const tds = tr.querySelectorAll('td input');
        hijos.push([tds[0].value, tds[1].value, tds[2].value]);
    });
    localStorage.setItem("formRH_hijos", JSON.stringify(hijos));
}
function cargarHijos() {
    const hijosString = localStorage.getItem("formRH_hijos");
    if(!hijosString) return;
    const hijos = JSON.parse(hijosString);
    document.querySelectorAll("#hijos_tabla tr:not(:first-child)").forEach((tr, idx) => {
        const tds = tr.querySelectorAll('td input');
        if(hijos[idx]) {
            tds[0].value = hijos[idx][0];
            tds[1].value = hijos[idx][1];
            tds[2].value = hijos[idx][2];
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    cargarCampos();
    cargarHijos();
    document.querySelectorAll("#hijos_tabla tr:not(:first-child) td input")
        .forEach(input => input.addEventListener("input", guardarHijos));
});

// Guardar y cargar la foto
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const label = document.querySelector(".photo-label");
let fotoDataURL = '';

function guardarFoto(dataURL) {
    localStorage.setItem("formRH_foto", dataURL);
}
function cargarFoto() {
    const fotoLS = localStorage.getItem("formRH_foto");
    if(fotoLS) {
        fotoDataURL = fotoLS;
        preview.src = fotoDataURL;
        preview.style.display = "block";
        label.style.display = "none";
    }
}
photoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            fotoDataURL = ev.target.result;
            preview.src = fotoDataURL;
            preview.style.display = "block";
            label.style.display = "none";
            guardarFoto(fotoDataURL);
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
        preview.style.display = "none";
        label.style.display = "";
        fotoDataURL = '';
        guardarFoto('');
    }
});

document.addEventListener("DOMContentLoaded", cargarFoto);

// ----- PDF -----
function descargarPDF() {
    document.querySelector('.btn-row').style.visibility = 'hidden';
    html2canvas(document.getElementById("formulario")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('Formulario_Recursos_Humanos.pdf');
        document.querySelector('.btn-row').style.visibility = 'visible';
    });
}

function limpiarDatos() {
    if(confirm("¿Seguro que desea borrar todos los datos del formulario?")) {
        campos.forEach(id => {
            document.getElementById(id).value = "";
            localStorage.removeItem("formRH_" + id);
        });
        document.querySelectorAll("#hijos_tabla tr:not(:first-child) td input")
            .forEach(input => input.value = "");
        localStorage.removeItem("formRH_hijos");
        preview.src = "";
        preview.style.display = "none";
        label.style.display = "";
        fotoDataURL = '';
        localStorage.removeItem("formRH_foto");
    }
}