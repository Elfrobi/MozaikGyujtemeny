let collections = {};
let elements = {};

$('#newCollection').click(function() {
    $('#collectionForm').show();
});

$('#create').click(function() {
    let title = $('#title').val().trim();
    let topic = $('#topic').val().trim();
    let date = $('#date').val().trim();
    let imageField = $('#image');
    let image = imageField[0].files.length > 0 ? imageField[0].files[0] : null;

    if (title === '') {
        alert('A cím mező kitöltése kötelező!');
        return;
    } else if (topic === '') {
        alert('A témakör mező kitöltése kötelező!');
        return;
    } else if (date === '') {
        alert('A dátum mezők kitöltése kötelező! (A naptárból válaszd ki a dátumot)');
        return;
    }

    if (collections[title]) {
        alert('Már létezik egy ilyen című gyűjtemény!');
        return;
    }

    // Gyűjtemény kiíratása
    let li = $('<li></li>');
    let titleField = $('<span></span>').addClass('title').text(`Gyűjtemény címe: ${title}`);
    let topicField = $('<span></span>').addClass('topic').text(`Témakör: ${topic}`);
    let dateField = $('<span></span>').addClass('date').text(`Dátum: ${date}`);

    if (image) {
        let imageDisplay = $('<img>').attr('src', URL.createObjectURL(image)).height(100);
        li.append(imageDisplay);
    }

    li.append(titleField);
    li.append(topicField);
    li.append(dateField);

    // Gyűjtemény átnevezése
    let renameButton = $('<button></button>').text('Átnevezés');
    renameButton.click(function() {
        let newTitle = prompt('Adj meg az új címet:');
        if (!newTitle) {
            alert('A gyűjtemény címének megadása kötelező!');
            return;
        }
        if (collections[newTitle]) {
            alert('Már létezik egy ilyen című gyűjtemény!');
            return;
        }
        let collection = collections[title];
        collection.title = newTitle;
        collections[newTitle] = collection;
        delete collections[title];
        title = newTitle;
        titleField.text(`Gyűjtemény címe: ${newTitle}`);
    });

    li.append(renameButton);

    // Elemek hozzáadása, megjelenítése
    let collection = $('<ul></ul>');
    li.append(collection);

    // Gyűjtemény létrehozása
    collections[title] = {
        collection: collection,
        elementNumber: 0,
        deleteAllButton: null
    };

    let addButton = $('<button></button>').text('Új elem hozzáadása');
    addButton.click(function() {
        let elementTitle = prompt('Adj meg az elem címét:');
        if (!elementTitle) {
            alert('Az elem cím mező kitöltése kötelező!');
            return;
        }
        let elementTitleField = document.createTextNode(`Elem címe: ${elementTitle}`);
        let itemLi = $('<li></li>').addClass('itemList');
        let checkbox = $('<input>').attr('type', 'checkbox');
        itemLi.append(checkbox);
        itemLi.append(elementTitleField);

        // Legördülő menü
        let dropdownDiv = $('<div></div>').addClass('dropdown');
        let dropdownButton = $('<button></button>').text('⚙️').addClass('dropdownButton');
        dropdownDiv.append(dropdownButton);
        let dropdownContentDiv = $('<div></div>').addClass('dropdown-content');

       let moveButton = $('<button></button>').text('Áthelyezés');
        moveButton.click(function() {
            let collectionTitle = prompt('Adjad meg a gyűjtemény címét, ahova át szeretnéd helyezni az elemet:');
            if (collections[collectionTitle]) {
                collections[collectionTitle].collection.append(itemLi);
                title = collectionTitle;
            } else {
                alert('Nem létezik ilyen című gyűjtemény!');
            }
        });
        dropdownContentDiv.append(moveButton);

        let renameButton = $('<button></button>').text('Átnevezés');
        renameButton.click(function() {
            let newElementTitle = prompt('Adj meg az új címet:');
            if (!newElementTitle) {
                alert('Az elem címének megadása kötelező!');
                return;
            }
            elements[newElementTitle] = elements[elementTitle];
            delete elements[elementTitle];
            elementTitle = newElementTitle;
            elementTitleField.nodeValue = `Elem címe: ${newElementTitle}`;
        });

        dropdownContentDiv.append(renameButton);

        let deleteButton = $('<button></button>').text('Törlés');
        deleteButton.click(function() {
            itemLi.remove();
            delete elements[elementTitle];
            collections[title].elementNumber--;

            // Ha már nincs elem a gyűjteményben, eltávolítjuk az "Elemek törlése" gombot
            if (collections[title].elementNumber === 0 && collections[title].deleteAllButton) {
                collections[title].deleteAllButton.remove();
                collections[title].deleteAllButton = null;
            }
        });

        dropdownContentDiv.append(deleteButton);
        dropdownDiv.append(dropdownContentDiv);
        itemLi.append(dropdownDiv);
        collections[title].collection.append(itemLi);
        elements[elementTitle] = itemLi;

        // Az "Elemek törlése" gombot csak akkor jelenítjük meg, ha van elem a gyűjteményben
        if (collections[title].elementNumber === 0) {
            let deleteAllButton = $('<button></button>').text('Elemek törlése');
            deleteAllButton.click(function() {
                let checkboxes = collection.find('input');
                let noCheckboxSelected = true;
                for (let i = checkboxes.length - 1; i >= 0; i--) {
                    if (checkboxes[i].checked) {
                        noCheckboxSelected = false;
                        let itemLi = checkboxes[i].parentNode;
                        let elementTitle = itemLi.textContent.trim();
                        itemLi.remove();
                        delete elements[elementTitle];
                        collections[title].elementNumber--;
                    }
                }
                if (noCheckboxSelected) {
                    alert('Jelöld ki a törölni kívánt elemet!');
                }
                // Ha már nincs elem a gyűjteményben, eltávolítjuk az "Elemek törlése" gombot
                if (collections[title].elementNumber === 0) {
                    deleteAllButton.remove();
                    collections[title].deleteAllButton = null;
                }
            });
            li.append(deleteAllButton);
            collections[title].deleteAllButton = deleteAllButton;
        }
        collections[title].elementNumber++;
    });

    li.append(addButton);
    $('#collectionList').append(li);
    $('#title').val('');
    $('#topic').val('');
    $('#date').val('');
    $('#image').val('');
    $('#collectionForm').hide();
});
