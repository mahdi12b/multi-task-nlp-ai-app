import { CommonModule } from "@angular/common"
import { HttpClient, HttpClientModule } from "@angular/common/http"
import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"

interface EntityType {
  id: string
  name: string
  description: string
  color: string
  enabled: boolean
}

interface Entity {
  text: string
  type: string
  start: number
  end: number
  confidence: number
  context?: string
}

interface Example {
  title: string
  description: string
  text: string
  iconClass: string
  iconPath: string
  expectedEntities: string[]
}
@Component({
  selector: 'app-ner',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule ],
  templateUrl: './ner.component.html',
  styleUrl: './ner.component.css'
})
export class NerComponent{
  inputText = ""
  annotatedText = ""
  entities: Entity[] = []
  isLoading = false
  selectedLanguage = "fr"
  entityFilter = "all"
  
  
  constructor(private http: HttpClient) {}


  entityTypes: EntityType[] = [
    {
      id: "PERSON",
      name: "Personnes",
      description: "Noms de personnes, prénoms, personnalités",
      color: "#3b82f6",
      enabled: true,
    },
    {
      id: "ORG",
      name: "Organisations",
      description: "Entreprises, institutions, associations",
      color: "#10b981",
      enabled: true,
    },
    {
      id: "LOCATION",
      name: "Lieux",
      description: "Villes, pays, régions, adresses",
      color: "#f59e0b",
      enabled: true,
    },
    {
      id: "DATE",
      name: "Dates",
      description: "Dates, périodes, moments temporels",
      color: "#8b5cf6",
      enabled: true,
    },
    {
      id: "MONEY",
      name: "Montants",
      description: "Sommes d'argent, devises, prix",
      color: "#06b6d4",
      enabled: false,
    },
    {
      id: "PRODUCT",
      name: "Produits",
      description: "Noms de produits, marques, services",
      color: "#ef4444",
      enabled: false,
    },
    {
      id: "EVENT",
      name: "Événements",
      description: "Événements historiques, manifestations",
      color: "#84cc16",
      enabled: false,
    },
    {
      id: "MISC",
      name: "Divers",
      description: "Autres entités nommées",
      color: "#6b7280",
      enabled: false,
    },
  ]

  examples: Example[] = [
    {
      title: "Article de presse",
      description: "Actualité avec personnes, lieux et organisations",
      iconClass: "news",
      iconPath:
        "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      expectedEntities: ["PERSON", "ORG", "LOCATION", "DATE"],
      text: `Le président Emmanuel Macron s'est rendu hier à Berlin pour rencontrer la chancelière allemande Angela Merkel. Cette visite officielle, qui s'est déroulée au Bundestag, avait pour objectif de discuter des relations franco-allemandes et de l'avenir de l'Union européenne.

Les deux dirigeants ont abordé plusieurs sujets cruciaux, notamment la politique économique européenne et la coopération en matière de défense. Emmanuel Macron a souligné l'importance du partenariat entre la France et l'Allemagne dans la construction européenne.

Cette rencontre intervient dans un contexte particulier, alors que l'Europe fait face à de nombreux défis. Les discussions se sont poursuivies en présence du ministre des Affaires étrangères Jean-Yves Le Drian et de son homologue allemand Heiko Maas.

La visite s'est achevée par une conférence de presse conjointe où les deux chefs d'État ont réaffirmé leur engagement commun pour une Europe plus forte et plus unie.`,
    },
    {
      title: "Communiqué d'entreprise",
      description: "Annonce corporate avec organisations et montants",
      iconClass: "business",
      iconPath:
        "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      expectedEntities: ["ORG", "PERSON", "MONEY", "LOCATION"],
      text: `Apple Inc. annonce aujourd'hui l'acquisition de la startup française Dataiku pour un montant de 2,5 milliards de dollars. Cette transaction, approuvée par le conseil d'administration d'Apple, permettra au géant de Cupertino de renforcer ses capacités en intelligence artificielle.

Tim Cook, PDG d'Apple, a déclaré : "Cette acquisition s'inscrit dans notre stratégie de développement de l'IA et du machine learning. L'équipe de Dataiku, dirigée par Florian Douetteau, apportera une expertise précieuse à nos équipes de Cupertino et de Paris."

Dataiku, fondée en 2013 à Paris, emploie actuellement 800 personnes dans le monde. La société a levé 400 millions de dollars lors de son dernier tour de financement en 2021, atteignant une valorisation de 4,6 milliards de dollars.

Cette acquisition devrait être finalisée au premier trimestre 2024, sous réserve des approbations réglementaires habituelles. Les employés de Dataiku conserveront leurs postes et continueront à opérer depuis leurs bureaux de Paris, New York et Singapour.`,
    },
    {
      title: "Article académique",
      description: "Texte scientifique avec chercheurs et institutions",
      iconClass: "academic",
      iconPath:
        "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
      expectedEntities: ["PERSON", "ORG", "LOCATION", "DATE"],
      text: `Une équipe de recherche internationale dirigée par le professeur Marie Dubois de l'Université de la Sorbonne a publié une étude révolutionnaire dans la revue Nature le 15 mars 2024. Cette recherche, menée en collaboration avec le MIT et l'Université de Cambridge, présente une nouvelle approche pour le traitement du cancer.

L'étude, intitulée "Thérapie génique ciblée : une approche innovante", a été réalisée sur une période de trois ans avec un financement de 5 millions d'euros de la part de l'Agence nationale de la recherche (ANR). Les travaux ont été menés dans les laboratoires de Paris, Boston et Cambridge.

Le docteur John Smith du MIT et la professeure Sarah Johnson de Cambridge ont contribué de manière significative à cette recherche. Les résultats montrent une efficacité de 85% dans le traitement de certains types de tumeurs, ouvrant de nouvelles perspectives thérapeutiques.

Cette découverte pourrait révolutionner le traitement du cancer d'ici 2030, selon les estimations des chercheurs. L'équipe prévoit de lancer des essais cliniques dès septembre 2024 dans plusieurs hôpitaux européens et américains.`,
    },
    {
      title: "Document juridique",
      description: "Contrat avec parties, dates et montants",
      iconClass: "legal",
      iconPath:
        "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
      expectedEntities: ["ORG", "PERSON", "MONEY", "DATE", "LOCATION"],
      text: `CONTRAT DE PRESTATION DE SERVICES

Entre les soussignés :

La société TECH INNOVATIONS SARL, au capital de 50 000 euros, immatriculée au RCS de Paris sous le numéro 123 456 789, ayant son siège social au 15 rue de la Paix, 75001 Paris, représentée par Monsieur Pierre Martin, Directeur Général, ci-après dénommée "le Prestataire".

Et

La société CLIENT SOLUTIONS SAS, au capital de 100 000 euros, immatriculée au RCS de Lyon sous le numéro 987 654 321, ayant son siège social au 42 avenue de la République, 69001 Lyon, représentée par Madame Sophie Durand, Présidente, ci-après dénommée "le Client".

Il a été convenu ce qui suit :

ARTICLE 1 - OBJET
Le présent contrat a pour objet la fourniture de services de développement informatique par le Prestataire au profit du Client, pour une durée de 12 mois à compter du 1er janvier 2024.

ARTICLE 2 - PRIX
Le montant total de la prestation s'élève à 120 000 euros HT, payable en 12 mensualités de 10 000 euros HT chacune, le 30 de chaque mois.

Fait à Paris, le 15 décembre 2023, en deux exemplaires originaux.`,
    },
  ]

  // Text analysis methods
  getWordCount(): number {
    if (!this.inputText.trim()) return 0
    return this.inputText.trim().split(/\s+/).length
  }



  getCharCount(): number {
    return this.inputText.length
  }

  getTotalEntities(): number {
    return this.entities.length
  }

  getUniqueEntityTypes(): number {
    const types = new Set(this.entities.map((e) => e.type))
    return types.size
  }

  hasEnabledEntityTypes(): boolean {
    return this.entityTypes.some((type) => type.enabled)
  }

  // Text manipulation methods
  clearText(): void {
    this.inputText = ""
    this.annotatedText = ""
    this.entities = []
  }

  async pasteFromClipboard(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText()
      this.inputText = text
    } catch (err) {
      console.error("Erreur lors du collage:", err)
      alert("Veuillez coller le texte manuellement (Ctrl+V)")
    }
  }

  loadExample(example: Example): void {
    this.inputText = example.text
    this.annotatedText = ""
    this.entities = []

    // Enable relevant entity types for the example
    this.entityTypes.forEach((type) => {
      type.enabled = example.expectedEntities.includes(type.id)
    })
  }

  // Entity analysis
  analyzeText(): void {
    if (!this.inputText.trim() || this.isLoading || !this.hasEnabledEntityTypes()) return;

    this.isLoading = true;
    this.annotatedText = "";
    this.entities = [];

    const request = {
      text: this.inputText,
      language: this.selectedLanguage,
      entity_types: this.entityTypes
        .filter(type => type.enabled)
        .map(type => type.id)
    };

    this.http.post<any>('http://127.0.0.1:8000/ner', request).subscribe({
      next: (response) => {
        console.log(response)
        // Transformez la réponse du backend pour correspondre à votre interface Entity
        this.entities = response.entities.map((entity: any) => ({

          text: entity.word,
          type: this.mapBackendEntityType(entity.entity),
          start: entity.start,
          end: entity.end,
          confidence: entity.score,
          context: this.getEntityContext(entity.start, entity.word.length)
        }));
        this.generateAnnotatedText();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API, utilisation du mock', err);
        // this.performMockNER();
        this.generateAnnotatedText();
        this.isLoading = false;
      }
    });
  }

  private mapBackendEntityType(backendType: string): string {
    // Mappez les types d'entités du backend vers vos types frontend
    const typeMap: Record<string, string> = {
      'PER': 'PERSON',
      'ORG': 'ORG',
      'LOC': 'LOCATION',
      'DATE': 'DATE',
      'MISC': 'MISC'
    };
    return typeMap[backendType] || 'MISC';
  }


  // private performMockNER(): void {
  //   const enabledTypes = this.entityTypes.filter((type) => type.enabled)
  //   if (enabledTypes.length === 0) return

  //   // Mock entity patterns for different types
  //   const patterns: { [key: string]: RegExp[] } = {
  //     PERSON: [
  //       /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
  //       /\b(?:M\.|Mme|Monsieur|Madame|Dr|Professeur|président|PDG|directeur)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/gi,
  //     ],
  //     ORG: [
  //       /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Inc\.|SARL|SAS|SA|Corp|Corporation|Company|Ltd|GmbH|AG)\b/g,
  //       /\b(?:Université|MIT|Apple|Google|Microsoft|Amazon|Facebook|Tesla|Netflix)\b/gi,
  //     ],
  //     LOCATION: [
  //       /\b(?:Paris|Londres|Berlin|New York|Tokyo|Madrid|Rome|Amsterdam|Bruxelles|Genève|Zurich|Munich|Barcelone|Milan|Stockholm|Copenhague|Helsinki|Oslo|Dublin|Lisbonne|Athènes|Prague|Varsovie|Budapest|Vienne|Cupertino|Boston|Cambridge|Lyon|Marseille|Toulouse|Nice|Strasbourg|Lille|Bordeaux|Nantes|Montpellier|Rennes|Reims|Le Havre|Saint-Étienne|Toulon|Grenoble|Dijon|Angers|Nîmes|Villeurbanne|Le Mans|Aix-en-Provence|Clermont-Ferrand|Brest|Limoges|Tours|Amiens|Perpignan|Metz|Besançon|Boulogne-Billancourt|Orléans|Mulhouse|Rouen|Saint-Denis|Argenteuil|Caen|Nancy|Tourcoing|Roubaix|Nanterre|Vitry-sur-Seine|Créteil|Avignon|Poitiers|Dunkerque|Aulnay-sous-Bois|Asnières-sur-Seine|Colombes|Saint-Pierre|Versailles|Courbevoie|Fort-de-France|Rueil-Malmaison|Pau|Aubervilliers|Champigny-sur-Marne|Antibes|La Rochelle|Cannes|Calais|Béziers|Colmar|Bourges|Drancy|Mérignac|Saint-Nazaire|Valence|Ajaccio|Issy-les-Moulineaux|Villeneuve-d'Ascq|Levallois-Perret|Noisy-le-Grand|Quimper|La Seyne-sur-Mer|Antony|Troyes|Neuilly-sur-Seine|Sarcelles|Les Abymes|Vénissieux|Clichy|Lorient|Pessac|Ivry-sur-Seine|Cergy|Cayenne|Niort|Chambéry|Le Cannet|Aix-les-Bains|Bourg-en-Bresse|Arles|La Roche-sur-Yon|Boulogne-sur-Mer|Charleville-Mézières|Cholet|Saint-Quentin|Beauvais|Laval|Maisons-Alfort|Chelles|Évreux|Hyères|Fréjus|Épinay-sur-Seine|Bobigny|Meaux|Blois|Chalon-sur-Saône|Roanne|Castres|Sartrouville|Taverny|Joué-lès-Tours|Bayonne|Belfort|Saint-Ouen|Sète|Thonon-les-Bains|Montluçon|Conflans-Sainte-Honorine|Vincennes|Clamart|Sainte-Geneviève-des-Bois|Garges-lès-Gonesse|Houilles|Épinal|Schiltigheim|Pontoise|Fontenay-sous-Bois|Palaiseau|Poissy|Livry-Gargan|Montrouge|Neuilly-sur-Marne|Corbeil-Essonnes|Viry-Châtillon|Massy|Cherbourg-Octeville|Saint-Brieuc|Vannes|Annecy|Angoulême|Brive-la-Gaillarde|Montauban|Albi|Agen|Tarbes|Auch|Rodez|Mende|Privas|Gap|Digne-les-Bains|Avignon|Orange|Carpentras|Apt|Cavaillon|Salon-de-Provence|Martigues|Aubagne|Istres|Marignane|Vitrolles|Gardanne|Bouc-Bel-Air|Peyrolles-en-Provence|Lambesc|Pélissanne|Eyguières|Aureille|Eygalières|Maussane-les-Alpilles|Paradou|Fontvieille|Arles|Tarascon|Beaucaire|Bellegarde|Manduel|Redessan|Jonquières-Saint-Vincent|Sernhac|Théziers|Domazan|Estezargues|Rochefort-du-Gard|Poulx|Vers-Pont-du-Gard|Castillon-du-Gard|Remoulins|Collias|Uzès|Saint-Quentin-la-Poterie|Blauzac|Flaux|Sanilhac-Sagriès|Argilliers|Saint-Bonnet-du-Gard|Garrigues-Sainte-Eulalie|Saint-Hilaire-d'Ozilhan|Saint-Laurent-la-Vernède|Cabrières|Soustelle|Générargues|Mialet|Saint-Jean-du-Gard|Anduze|Bagard|Massillargues-Attuech|Tornac|Boisset-et-Gaujac|Boucoiran-et-Nozières|Brouzet-lès-Alès|Deaux|Euzet|Méjannes-lès-Alès|Mons|Navacelles|Ribaute-les-Tavernes|Rousson|Saint-Christol-lès-Alès|Saint-Hilaire-de-Brethmas|Saint-Jean-du-Pin|Saint-Martin-de-Valgalgues|Saint-Privat-des-Vieux|Salindres|Servas|Vézénobres|Alès|Bessèges|La Grand-Combe|Saint-Ambroix|Barjac|Pont-Saint-Esprit|Bagnols-sur-Cèze|Villeneuve-lès-Avignon|Les Angles|Saze|Roquemaure|Tavel|Lirac|Saint-Laurent-des-Arbres|Saint-Geniès-de-Comolas|Pujaut|Montfrin|Meynes|Fournès|Comps|Chusclan|Codolet|Laudun-l'Ardoise|Saint-Victor-la-Coste|Sabran|Saint-Alexandre|Gaujac|Orsan|Vénéjan|Saint-Étienne-des-Sorts|Saint-Gervais|Issirac|Cornillon|Goudargues|Montclus|Aiguèze|Le Garn|Pougnadoresse|Rivière-sur-Tarn|Mostuéjouls|Peyreleau|Millau|Creissels|Saint-Georges-de-Luzençon|Paulinet|Comprégnac|Aguessac|Rivière-sur-Tarn|La Cresse|Veyreau|Aveyron|Rodez|Villefranche-de-Rouergue|Millau|Decazeville|Capdenac-Gare|Espalion|Saint-Affrique|Laguiole|Marcillac-Vallon|Rignac|Baraqueville|Onet-le-Château|Sébazac-Concourès|Luc-la-Primaube|Bozouls|Laissac|Réquista|Cassagnes-Bégonhès|Salles-la-Source|Conques|Entraygues-sur-Truyère|Estaing|Golinhac|Mur-de-Barrez|Sainte-Geneviève-sur-Argence|Saint-Chély-d'Aubrac|Nauviale|Gabriac|Moyrazès|Druelle|Flavin|Olemps|Sébazac-Concourès|Luc-la-Primaube|Bozouls|Laissac|Réquista|Cassagnes-Bégonhès|Salles-la-Source|Conques|Entraygues-sur-Truyère|Estaing|Golinhac|Mur-de-Barrez|Sainte-Geneviève-sur-Argence|Saint-Chély-d'Aubrac|Nauviale|Gabriac|Moyrazès|Druelle|Flavin|Olemps)\b/gi,
  //       /\b\d+\s+(?:rue|avenue|boulevard|place|impasse|allée|chemin|route)\s+[A-Za-z\s-]+\b/gi,
  //     ],
  //     DATE: [
  //       /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
  //       /\b\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4}\b/gi,
  //       /\b(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b/gi,
  //       /\b(?:hier|aujourd'hui|demain|ce matin|cet après-midi|ce soir)\b/gi,
  //       /\b\d{4}\b/g,
  //     ],
  //     MONEY: [
  //       /\b\d+(?:[,.]\d+)?\s*(?:euros?|€|dollars?|\$|livres?|£|yens?|¥)\b/gi,
  //       /\b\d+(?:[,.]\d+)?\s*(?:millions?|milliards?)\s+(?:d'euros?|de dollars?|d'€|\$)\b/gi,
  //     ],
  //     PRODUCT: [
  //       /\biPhone\s*\d*\b/gi,
  //       /\biPad\s*\w*\b/gi,
  //       /\bMacBook\s*\w*\b/gi,
  //       /\bWindows\s*\d*\b/gi,
  //       /\bOffice\s*\d*\b/gi,
  //     ],
  //     EVENT: [
  //       /\b(?:Coupe du monde|Jeux olympiques|Festival de Cannes|Roland-Garros|Tour de France)\b/gi,
  //       /\b(?:conférence|sommet|réunion|assemblée|conseil)\s+[A-Za-z\s-]+\b/gi,
  //     ],
  //   }

  //   const foundEntities: Entity[] = []
  //   const entityId = 0

  //   enabledTypes.forEach((entityType) => {
  //     const typePatterns = patterns[entityType.id] || []

  //     typePatterns.forEach((pattern) => {
  //       let match
  //       while ((match = pattern.exec(this.inputText)) !== null) {
  //         const entity: Entity = {
  //           text: match[0],
  //           type: entityType.id,
  //           start: match.index,
  //           end: match.index + match[0].length,
  //           confidence: 0.7 + Math.random() * 0.3,
  //           context: this.getEntityContext(match.index, match[0].length),
  //         }

  //         // Avoid duplicates
  //         if (!foundEntities.some((e) => e.start === entity.start && e.end === entity.end)) {
  //           foundEntities.push(entity)
  //         }
  //       }
  //     })
  //   })

  //   // Sort entities by position
  //   this.entities = foundEntities.sort((a, b) => a.start - b.start)
  // }

  private getEntityContext(start: number, length: number): string {
    const contextLength = 50
    const contextStart = Math.max(0, start - contextLength)
    const contextEnd = Math.min(this.inputText.length, start + length + contextLength)

    let context = this.inputText.substring(contextStart, contextEnd)

    if (contextStart > 0) context = "..." + context
    if (contextEnd < this.inputText.length) context = context + "..."

    return context
  }

  private generateAnnotatedText(): void {
    if (this.entities.length === 0) {
      this.annotatedText = this.inputText
      return
    }

    let annotated = ""
    let lastIndex = 0

    this.entities.forEach((entity) => {
      // Add text before entity
      annotated += this.inputText.substring(lastIndex, entity.start)

      // Add annotated entity
      const entityType = this.entityTypes.find((type) => type.id === entity.type)
      const color = entityType?.color || "#6b7280"

      annotated += `<span class="entity" style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}40;" title="${entityType?.name}: ${entity.confidence.toFixed(2)}">${entity.text}</span>`

      lastIndex = entity.end
    })

    // Add remaining text
    annotated += this.inputText.substring(lastIndex)

    this.annotatedText = annotated
  }

  // Helper methods for display
  getActiveEntityTypes(): EntityType[] {
    return this.entityTypes.filter((type) => type.enabled && this.entities.some((entity) => entity.type === type.id))
  }

  getEntityCount(typeId: string): number {
    return this.entities.filter((entity) => entity.type === typeId).length
  }

  getFilteredEntities(): Entity[] {
    if (this.entityFilter === "all") {
      return this.entities
    }
    return this.entities.filter((entity) => entity.type === this.entityFilter)
  }

  getEntityTypeColor(typeId: string): string {
    const entityType = this.entityTypes.find((type) => type.id === typeId)
    return entityType?.color || "#6b7280"
  }

  getEntityTypeName(typeId: string): string {
    const entityType = this.entityTypes.find((type) => type.id === typeId)
    return entityType?.name || typeId
  }

  // Export methods
  exportAsJSON(): void {
    const exportData = {
      text: this.inputText,
      language: this.selectedLanguage,
      entities: this.entities,
      entityTypes: this.entityTypes.filter((type) => type.enabled),
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "ner-analysis.json"
    link.click()
    window.URL.revokeObjectURL(url)
  }

  exportAsCSV(): void {
    const headers = ["Entité", "Type", "Position début", "Position fin", "Confiance", "Contexte"]
    const csvContent = [
      headers.join(","),
      ...this.entities.map((entity) =>
        [
          `"${entity.text}"`,
          this.getEntityTypeName(entity.type),
          entity.start,
          entity.end,
          entity.confidence.toFixed(3),
          `"${entity.context || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "ner-entities.csv"
    link.click()
    window.URL.revokeObjectURL(url)
  }

  async copyEntities(): Promise<void> {
    const entitiesText = this.entities
      .map(
        (entity) =>
          `${entity.text} (${this.getEntityTypeName(entity.type)}) - ${(entity.confidence * 100).toFixed(1)}%`,
      )
      .join("\n")

    try {
      await navigator.clipboard.writeText(entitiesText)
      console.log("Entités copiées dans le presse-papiers")
    } catch (err) {
      console.error("Erreur lors de la copie:", err)
    }
  }
}

