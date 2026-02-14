from flask import Flask, jsonify
from flask_cors import CORS
import requests
from pyjstat import pyjstat

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173","https://joonas-hh-dev.github.io"])

BASE_URL = "https://pxdata.stat.fi:443/PxWeb/api/v1/fi/StatFin/ashi/statfin_ashi_pxt_13mu.px"

HELSINKI_POSTINUMEROT = [
    "00100","00120","00130","00140","00150","00160","00170","00180","00190",
    "00200","00210","00220","00240","00250","00260","00270","00280","00290",
    "00300","00310","00320","00330","00340","00350","00360","00370","00380","00390",
    "00400","00410","00420","00430","00440","00500","00510","00520","00530","00540",
    "00550","00560","00570","00580","00590","00600","00610","00620","00630","00640",
    "00650","00660","00670","00680","00690","00700","00710","00720","00730","00740",
    "00750","00760","00770","00780","00790","00800","00810","00820","00830","00840",
    "00850","00870","00880","00890","00900","00910","00920","00930","00940","00950",
    "00960","00970","00980","00990"
]

@app.route("/healthz")
def healthz():
    return "ok", 200

@app.route("/api/hinnat", methods=["GET"])
def get_hinnat():
    query = {
        "query": [
            {
                "code": "Postinumero",
                "selection": {"filter": "item", "values": HELSINKI_POSTINUMEROT}
            }
        ],
        "response": {"format": "json-stat2"}
    }

    response = requests.post(BASE_URL, json=query)
    if response.status_code != 200:
        return jsonify({"error": response.status_code, "message": response.text}), response.status_code

    dataset = pyjstat.from_json_stat(response.json(object_pairs_hook=dict))
    df = dataset[0]

    # Näytä mitä arvoja Tiedot-sarakkeessa on (debug)
    # print("Tiedot-arvot:", df["Tiedot"].unique())

    # Pivotointi: tee Tiedot-sarakkeen arvoista omat sarakkeet
    df = df.pivot_table(
        index=["Postinumero", "Vuosi", "Talotyyppi"],
        columns="Tiedot",
        values="value"
    ).reset_index()

    # Etsi automaattisesti sarakkeet, joissa on hinta ja kauppojen määrä
    hinta_col = next((c for c in df.columns if "hinta" in c.lower()), None)
    lkm_col = next((c for c in df.columns if "luku" in c.lower() or "kaupp" in c.lower()), None)

    if not hinta_col or not lkm_col:
        return jsonify({"error": "Data format changed", "columns": list(df.columns)}), 500

    # Nimeä selkeästi
    df = df.rename(columns={
        hinta_col: "Keskihinta",
        lkm_col: "Kauppojen_lkm"
    })

    # Lisää postinumeroalue ja nimi
    df["PostinumeroAlue"] = df["Postinumero"].str.extract(r"^(\d{5})")
    df["Nimi"] = (
        df["Postinumero"]
        .str.replace(r"^\d{5}\s*", "", regex=True)
        .str.replace(r"\s*\(Helsinki\)", "", regex=True)
        .str.strip()
    )

    # Täytä puuttuvat arvot
    df["Keskihinta"] = df["Keskihinta"].fillna(0)
    df["Kauppojen_lkm"] = df["Kauppojen_lkm"].fillna(0)

    df = df.drop(columns=["Postinumero"])

    # print("Palautetaan rivejä:", len(df))
    return jsonify(df.to_dict(orient="records"))

@app.route("/", methods=["GET"])
def home():
    return "OK – käytä /api/hinnat", 200

if __name__ == "__main__":
    app.run(debug=True)
