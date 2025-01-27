export const selectCellEditor = function () {}

selectCellEditor.prototype = {
    
    init:function(params) {
        this.inputSelect = document.createElement('div');
        this.inputSelect.className = "dropdown";
        this.auxstring = "";
        params.margenes.forEach(element => {
            this.auxstring += '<button class="dropdown-item">'+element.descripcion+'</button>';
        });

        this.inputSelect.innerHTML = '<div class="dropdown">' +
      '<button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown"' + 
      'aria-haspopup="true" aria-expanded="false">Elegir Margen | ' +
      '<span class="caret"></span></button>' +
      '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' + this.auxstring +'</div>';
    },
    
    getValue: function () {
        return "hola";
    },
    getGui: function () {
        return this.inputSelect;
    },
    afterGuiAttached: function () {
        this.dropdown.focus(); this.dropdown.click(); 
    },

    isPopup: function(){
        return true;
    },

    destroy: function () {
        (this.inputSelect).remove();
    }
}