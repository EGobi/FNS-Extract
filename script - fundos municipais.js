FNSSuffix = "https://consultafns.saude.gov.br/recursos/consulta-detalhada/entidades?"
FNSSuffix_detalhe = "https://consultafns.saude.gov.br/recursos/consulta-detalhada/detalhe-acao?"
var csv_text = "data:text/csv;charset=utf-8,Data;Estado;Município;CNPJ;Razão social;Repasse;Total\r";

var count = 100;
var anos = [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
var meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
var estados = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']
var tipoConsulta = 2 // Fundo a Fundo
var linha = ""

var repasse_copagamento = 0
var repasse_gratuidade = 0

// De 04/2006 -

var blocos = ""
var componentes = ""
var grupo = ""

// De ?
/*
var blocos = 4 // ASSISTÊNCIA FARMACÊUTICA
var componentes = 32 // FARMÁCIA POPULAR
var grupo = ""
*/

// De ?
/*
var blocos = ""
var componentes = "" // Para selecionar ambos os abaixo
//var componentes = 107 // MANUTENCAO E FUNCIONAMENTO DO PROGRAMA FARMACIA POPULAR - CO-PAGAMENTO
//var componentes = 106 // MANUTENCAO E FUNCIONAMENTO DO PROGRAMA FARMACIA POPULAR - GRATUIDADE
var grupo = 28 // FARMACIA POPULAR
*/

function loadSearch(ano, mes, estado, pagina) {
    anoArgument = "ano=" + ano;
    blocosArgument = "&blocos=" + blocos;
    componentesArgument = "&componentes=" + componentes;
    countArgument = "&count=" + count;
    mesArgument = "&mes=" + mes;
    pageArgument = "&page=" + pagina;
    tipoConsultaArgument = "&tipoConsulta=" + tipoConsulta;
    grupoArgument = "&grupo=" + grupo;
    estadoArgument = "&estado=" + estado;
    fullArgumentsText = FNSSuffix + anoArgument + blocosArgument + componentesArgument + countArgument + mesArgument + pageArgument + estadoArgument + tipoConsultaArgument + grupoArgument

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
    xhr.send();
}

function loadData(ano, mes, estado, municipio, cnpj) {
    anoArgument = "ano=" + ano;
    blocosArgument = "&blocos=" + blocos;
    componentesArgument = "&componentes=" + componentes;
    mesArgument = "&mes=" + mes;
    tipoConsultaArgument = "&tipoConsulta=" + tipoConsulta;
    grupoArgument = "&grupo=" + grupo;
    estadoArgument = "&estado=" + estado;
    municipioArgument = "&municipio=" + municipio;
    cnpjArgument = "&cpfCnpjUg=" + cnpj;
    fullArgumentsText = FNSSuffix_detalhe + anoArgument + blocosArgument + componentesArgument + countArgument + mesArgument + "&page=1" + estadoArgument + municipioArgument + tipoConsultaArgument + cnpjArgument + grupoArgument

    var xhr = new XMLHttpRequest();
    var parser = new DOMParser();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            resposta_dado = JSON.parse(xhr.response);
        } else if (xhr.readyState == 4) {
            console.log("HTTP returned error code", xhr.status);
        }
    }

    xhr.open("GET", fullArgumentsText, false);
    xhr.send();
}

function csvComposer(ano, mes, estado) {
    for (i = 0; i < resposta.resultado.dados.length; i++) {
        mes_string = meses[mes].toString()
        ano_string = anos[ano].toString()

        mm = mes_string.length == 1 ? "0" + mes_string : mes_string
        yy = ano_string.substring(2)

        farmacia = resposta.resultado.dados[i]

        estado_string = estados[estado]
        municipio_string = farmacia.municipio
        cnpj_string = farmacia.cpfCnpj
        social_string = farmacia.razaoSocial

        loadData(anos[ano], meses[mes], estados[estado], farmacia.codigoMunicipioIBGE, farmacia.cpfCnpj, 1)

        //resposta_dado.resultado.total != 1 ? console.log("resposta_dado.resultado.total = " + resposta_dado.resultado.total + "!!") : 

        repasse = 0
        for (j = 0; j < resposta_dado.resultado.dados.length; j++) {
            if (resposta_dado.resultado.dados[j].sigla == "FARM POPULAR") {
                repasse = resposta_dado.resultado.dados[j].valorTotal
                console.log(social_string)
            } //else {
                //console.log(resposta_dado.resultado.dados[j].sigla)
            //}
        }

        //repasse_total = resposta_dado.resultado.dados[0].valorTotalGeral

        csv_text += `${mm}/${yy};${estado_string};${municipio_string};${cnpj_string};${social_string};${repasse}\r`
    }
}

function main() {
    for (ano in anos) {
        for (mes in meses) {
            for (estado in estados) {
                loadSearch(anos[ano], meses[mes], estados[estado], 1);
                console.log(meses[mes] + "/" + anos[ano] + ": [" + estados[estado] + "] " + resposta.resultado.total);
                
                csvComposer(ano, mes, estado);

                if (resposta.resultado.totalPaginas > 1) {
                    console.log("Detectadas", resposta.resultado.totalPaginas, "páginas")
                    for (pagina = 2; pagina <= resposta.resultado.totalPaginas; pagina++) {
                        loadSearch(anos[ano], meses[mes], estados[estado], pagina);
                        console.log(meses[mes] + "/" + anos[ano] + ": [" + estados[estado] + "] Página " + pagina);
                        csvComposer(ano, mes, estado);
                    }
                }
            }
        }
    }

    window.open(encodeURI(csv_text))
}
