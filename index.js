import express from "express";
import fs from "fs/promises";

const app = express();

app.use(express.json());

app.get("/zaposlenici", async (req, res) => {
  try {
    let sortiraj_po_godinama = req.query.sortiraj_po_godinama;
    let pozicija = req.query.pozicija;
    let godine_staza_min = req.query.godine_staza_min;
    let godine_staza_max = req.query.godine_staza_max;
    const data = await fs.readFile("./zaposlenici.json", "utf8");
    const zaposlenici = JSON.parse(data);

    if (pozicija) {
      const prema_poziciji = zaposlenici.filter(
        (zaposlenik) => zaposlenik.pozicija === pozicija
      );
      res.status(200).send(prema_poziciji);
    } else if (sortiraj_po_godinama) {
      if (sortiraj_po_godinama) {
        if (sortiraj_po_godinama === "uzlazno") {
          zaposlenici.sort((a, b) => a.godine_staza - b.godine_staza);
        } else if (sortiraj_po_godinama === "silazno") {
          zaposlenici.sort((a, b) => b.godine_staza - a.godine_staza);
        }
      }
    }
    res.status(200).send(zaposlenici);
  } catch (error) {
    console.error("Greška prilikom čitanja datoteke:", error);
    res.status(500).send("Greška prilikom čitanja datoteke.");
  }
});

app.get("/zaposlenici/:id", async (req, res) => {
  let sortiraj_po_godinama;
  const id = req.params.id;
  try {
    const data = await fs.readFile("./zaposlenici.json", "utf8");
    const zaposlenici = JSON.parse(data);
    const zaposlenik = zaposlenici.find((zaposlenik) => zaposlenik.id === id);
    if (zaposlenik) {
      if (sortiraj_po_godinama) {
        if (sortiraj_po_godinama === "uzlazno") {
          zaposlenici.sort((a, b) => a.godine_staza - b.godine_staza);
        } else if (sortiraj_po_godinama === "silazno") {
          zaposlenici.sort((a, b) => b.godine_staza - a.godine_staza);
        }
      }
      res.status(200).send(zaposlenik);
    } else {
      res.status(404).send("Zaposlenik nije pronađen.");
    }
  } catch (error) {
    console.error("Greška prilikom čitanja datoteke:", error);
    res.status(500).send("Greška prilikom čitanja datoteke.");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
