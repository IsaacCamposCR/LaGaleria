galleryApp.factory("calculator", function () {
    console.log("Registering calculator service...");

    var Product = function (type, name, refillRequired) {
        return {
            type: type,
            name: name,
            required: refillRequired,
            base: 0,
            height: 0,
            refill: 0,
            cmPrice: 0,
            total: 0
        };
    };

    //Bastidor con Tela
    var calculateFrame = function () {
        //Bastidor
        var frame = Product("Bastidor con Tela", "Bastidor", false);
        frame.calculate = function(){
            frame.cmPrice = (frame.base * frame.height);
        };

        //Tela
        var cloth = Product("Bastidor con Tela", "Tela", false);
        cloth.calculate = function(){
            cloth.cmPrice = (cloth.base * cloth.height);
        };

        return [frame, cloth];
    };

    //Corriente
    var calculateNormal = function () {
        //Moldura
        var molding = Product("Corriente", "Moldura", true);
        molding.calculate = function(){
            molding.cmPrice = (molding.base * molding.height);
        };

        //Maria Luisa Carton
        var cardboard = Product("Corriente", "Maria Luisa Carton", false);
        cardboard.calculate = function(){
            cardboard.cmPrice = (cardboard.base * cardboard.height);
        };

        //Filo
        var edge = Product("Corriente", "Filo", false);
        edge.calculate = function(){
            edge.cmPrice = (edge.base * edge.height);
        };

        return [molding, cardboard, edge];
    };

    //Oleo
    var calculateOil = function () {
        //Moldura
        var molding = Product("Oleo", "Moldura", true);
        molding.calculate = function(){
            molding.cmPrice = (molding.base * molding.height);
        };

        //Maria Luisa Madera
        var wood = Product("Oleo", "Maria Luisa Madera", true);
        wood.calculate = function(){
            wood.cmPrice = (wood.base * wood.height);
        };

        //Bastidor
        var frame = Product("Oleo", "Bastidor", false);
        frame.calculate = function(){
            frame.cmPrice = (frame.base * frame.height);
        };

        return [molding, wood, frame];
    };

    return {
        generateCalculators: function (type) {
            console.log("Generating calculators for... " + type);
            switch (type) {
                case "Bastidor":
                    return calculateFrame();
                case "Corriente":
                    return calculateNormal();
                case "Oleo":
                    return calculateOil();
            }
        }
    };
});