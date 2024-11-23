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
    let zaposlenici = JSON.parse(data);

    if (pozicija) {
      zaposlenici = zaposlenici.filter(
        (z) => z.pozicija.toLowerCase().trim() === pozicija.toLowerCase().trim()
      );
    }
    if (godine_staza_min) {
      zaposlenici = zaposlenici.filter(
        (z) => z.godine_staza >= parseInt(godine_staza_min)
      );
    }
    if (godine_staza_max) {
      zaposlenici = zaposlenici.filter(
        (z) => z.godine_staza <= parseInt(godine_staza_max)
      );
    }

    if (sortiraj_po_godinama) {
      if (sortiraj_po_godinama === "uzlazno") {
        zaposlenici.sort((a, b) => a.godine_staza - b.godine_staza);
      } else if (sortiraj_po_godinama === "silazno") {
        zaposlenici.sort((a, b) => b.godine_staza - a.godine_staza);
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

// Dodavanje zaposlenika
app.post("/zaposlenici", async (req, res) => {
  const ime = req.body.ime;
  const prezime = req.body.prezime;
  const godine_staza = req.body.godine_staza;
  const pozicija = req.body.pozicija;
  try {
    const data = await fs.readFile("./zaposlenici.json", "utf8");
    const zaposlenici = JSON.parse(data);
    const novi_zaposlenik = {
      id: String(zaposlenici.length + 1),
      ime,
      prezime,
      godine_staza: String(godine_staza),
      pozicija,
    };
    if (!ime || typeof ime !== "string")
      return res
        .status(400)
        .json({ error: "Ime je obavezno i mora biti string." });
    if (!prezime || typeof prezime !== "string")
      return res
        .status(400)
        .json({ error: "Prezime je obavezno i mora biti string." });
    if (!godine_staza || typeof godine_staza !== "number")
      return res
        .status(400)
        .json({ error: "Godine staža su obavezne i moraju biti broj." });
    if (!pozicija || typeof pozicija !== "string")
      return res
        .status(400)
        .json({ error: "Pozicija je obavezna i mora biti string." });
    zaposlenici.push(novi_zaposlenik);
    await fs.writeFile(
      "./zaposlenici.json",
      JSON.stringify(zaposlenici, null, 2)
    );
    res.status(201).json(novi_zaposlenik);
  } catch (error) {
    console.error("Greška prilikom čitanja datoteke:", error);
    res.status(500).send("Greška prilikom čitanja datoteke.");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
