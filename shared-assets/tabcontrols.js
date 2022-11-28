function openTab(e, tabName) {
    let i, tabcontent, tablinks, defaultcontent;
    //hide default content
    defaultcontent = document.getElementsByClassName('defaultcontent');
    for (i=0; i < defaultcontent.length; i++){
        defaultcontent[i].style.display = 'none';
    }

    tabcontent = document.getElementsByClassName('tabcontent');
    //set display to none to hide what isn't selected when another selection made
    for (i = 0; i < tabcontent.length; i++){
        tabcontent[i].style.display = 'none';
    }
    //remove active class from all tabs to reset things
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    //display the clicked tab and set attribute to active
    document.getElementById(tabName).style.display = "block";                
    e.currentTarget.className += " active";
    
}

function closeTab(e) {
    let i, tabcontent, tablinks, defaultcontent;
    tabcontent = document.getElementsByClassName('tabcontent');
    //set display to none to hide what isn't selected when another selection made
    for (i = 0; i < tabcontent.length; i++){
        tabcontent[i].style.display = 'none';
    }
    //remove active class from all tabs to reset things
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    //show default content
    defaultcontent = document.getElementsByClassName('defaultcontent');
    for (i=0; i < defaultcontent.length; i++){
        defaultcontent[i].style.display = 'block';
    }    
}