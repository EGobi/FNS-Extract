FNSSuffix = "https://consultafns.saude.gov.br/recursos/consulta-detalhada/entidades?"

var count = 100;
var anos = [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
var meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
var tipoConsulta = 3 // Outros Pagamentos

// De 04/2006 a 02/2011 (uma farmácia ainda conta nesse último mês)
// De 01/2017 em diante
var blocos = 7 // TRANSFERÊNCIAS NÃO REGULAMENTADAS POR BLOCO DE FINANCIAMENTO
var componentes = 12 // FARMACIA POPULAR
var grupo = ""

// De 02/2011 a 12/2016
var blocos = 4 // ASSISTÊNCIA FARMACÊUTICA
var componentes = 32 // FARMÁCIA POPULAR
var grupo = ""

// De 02/2018 em diante
var blocos = ""
var componentes = 107 // MANUTENCAO E FUNCIONAMENTO DO PROGRAMA FARMACIA POPULAR - CO-PAGAMENTO
var componentes = 106 // MANUTENCAO E FUNCIONAMENTO DO PROGRAMA FARMACIA POPULAR - GRATUIDADE
var grupo = 28 // FARMACIA POPULAR


function loadSearch() {
    anoArgument = "ano=" + ano;
    blocosArgument = "&blocos=" + blocos;
    componentesArgument = "&componentes=" + componentes;
    countArgument = "&count=" + count;
    mesArgument = "&mes=" + mes;
    pageArgument = "&page=" + page;
    tipoConsultaArgument = "&tipoConsulta=" + tipoConsulta;
    grupoArgument = "&grupo=" + grupo;
    fullArgumentsText = FNSSuffix + anoArgument + blocosArgument + componentesArgument + countArgument + mesArgument + pageArgument + tipoConsultaArgument

    var xhr = new XMLHttpRequest();
    var parser = new DOMParser();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            resposta = JSON.parse(xhr.response);
        } else if (xhr.readyState == 4) {
            console.log("HTTP returned error code", xhr.status);
        }
    }

    xhr.open("GET", fullArgumentsText, false);
    console.log("Requesting...");
    xhr.send();
}

/*

formas de extrair em 2018

componentes = 106; mes = 5; ano = 2018; loadSearch(); console.log(resposta.resultado.total)
componentes = 107; loadSearch(); console.log(resposta.resultado.total)

*/