const form = document.getElementById('uploadForm');
const resultado = document.getElementById('resultado');
const chooseInput = document.getElementById('chooseInput');
const fileName = document.getElementById('fileName');


chooseInput.addEventListener('change', function () {
  if (chooseInput.files.length > 0) {
 
    fileName.textContent = chooseInput.files[0].name;
  } else {

    fileName.textContent = 'Ningún archivo seleccionado';
  }
});

const spinner = document.createElement('div');
spinner.className = 'spinner';
spinner.style.display = 'none'; 
console.log('Estado inicial del spinner:', spinner.style.display); 

// Agregar el spinner al contenedor resultado
resultado.appendChild(spinner);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Mostrar el spinner
    spinner.style.display = 'block';
    console.log('Spinner mostrado:', spinner.style.display); 

    try {
        const res = await fetch('/quitar-fondo', {
            method: 'POST',
            body: new FormData(form)
        });

        if (res.ok) {
            console.log('Respuesta recibida del servidor');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'imagen_sin_fondo.png';
            link.textContent = 'Descargar imagen sin fondo';
            link.className = 'download-link';

            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '300px';
            img.className = 'processed-image'; 

            resultado.innerHTML = ''; 
            resultado.appendChild(img);
            resultado.appendChild(document.createElement('br'));
            resultado.appendChild(link);
        } else {
            alert('Error al quitar fondo');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al procesar la imagen.');
    } finally {
        spinner.style.display = 'none';
    }
});