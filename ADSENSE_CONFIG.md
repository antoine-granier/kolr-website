# 📢 Configuration AdSense

Ce document explique comment contrôler l'affichage des annonces AdSense sur votre site.

## 📁 Fichier de Configuration

Toute la configuration se trouve dans : **`config/adsense.ts`**

## ⚙️ Configuration Globale

```typescript
export const adsConfig = {
  // Activer/désactiver TOUTES les annonces d'un coup
  enabled: true, // Mettez à false pour désactiver toutes les annonces
  
  // Votre Publisher ID AdSense
  publisherId: "ca-pub-1962397436964429",
  
  // Configuration par page...
}
```

## 🎯 Configuration par Page

### Pages avec annonces (par défaut)

| Page | Activé | Ad Slot | Position |
|------|--------|---------|----------|
| **Homepage** | ✅ Oui | `1234567890` | Entre Tools et CTA Download |
| **Blog (liste)** | ✅ Oui | `1234567891` | Après la liste d'articles |
| **Blog (article)** | ✅ Oui | `1234567892` | Au milieu de l'article |

### Pages sans annonces (par défaut)

| Page | Activé | Raison |
|------|--------|--------|
| **Features** | ❌ Non | Focus sur les fonctionnalités |
| **Download** | ❌ Non | Page de conversion importante |
| **About** | ❌ Non | Page institutionnelle |
| **Tools** | ❌ Non | Outils interactifs |
| **Privacy** | ❌ Non | Politique de confidentialité |
| **Terms** | ❌ Non | Conditions d'utilisation |

## 🔧 Comment Modifier la Configuration

### 1. Activer/Désactiver une page

Éditez `config/adsense.ts` :

```typescript
pages: {
  home: {
    enabled: true, // ✅ Annonces activées
    adSlots: { ... }
  },
  features: {
    enabled: false, // ❌ Annonces désactivées
  },
}
```

### 2. Ajouter une annonce sur une nouvelle page

**Étape 1 : Ajouter la config**

Dans `config/adsense.ts` :

```typescript
pages: {
  // ... autres pages
  features: {
    enabled: true, // Activer les annonces
    adSlots: {
      topOfPage: "9876543210", // Votre ad slot ID
    },
  },
}
```

**Étape 2 : Ajouter le code dans la page**

Dans votre fichier de page (ex: `app/[locale]/features/page.tsx`) :

```tsx
import GoogleAdSense from "@/components/GoogleAdSense";
import { isAdEnabled, getAdSlot } from "@/config/adsense";

export default function FeaturesPage() {
  return (
    <>
      {/* Votre contenu */}
      
      {/* Annonce AdSense */}
      {isAdEnabled("features") && (
        <section className="section">
          <div className="container max-w-[800px]">
            <GoogleAdSense
              adSlot={getAdSlot("features", "topOfPage") || ""}
              adFormat="auto"
            />
          </div>
        </section>
      )}
    </>
  );
}
```

### 3. Modifier les Ad Slots (IDs AdSense)

Quand vous recevrez vos vrais ad slots d'AdSense, remplacez les IDs temporaires :

```typescript
pages: {
  home: {
    enabled: true,
    adSlots: {
      betweenSections: "1234567890", // ⚠️ Remplacez par votre vrai ad slot
    },
  },
}
```

## 📊 Exemples d'Usage

### Désactiver toutes les annonces temporairement

```typescript
export const adsConfig = {
  enabled: false, // 🚫 Toutes les annonces désactivées
  // ...
}
```

### Activer les annonces sur la page About

```typescript
about: {
  enabled: true, // ✅ Activer
  adSlots: {
    bottomOfPage: "1111111111", // Votre ad slot
  },
},
```

### Ajouter plusieurs annonces sur une même page

```typescript
home: {
  enabled: true,
  adSlots: {
    topBanner: "1234567890",
    betweenSections: "0987654321",
    sidebar: "1122334455",
  },
},
```

Puis dans la page :

```tsx
{isAdEnabled("home") && (
  <>
    {/* Annonce 1 */}
    <GoogleAdSense adSlot={getAdSlot("home", "topBanner") || ""} />
    
    {/* Annonce 2 */}
    <GoogleAdSense adSlot={getAdSlot("home", "betweenSections") || ""} />
    
    {/* Annonce 3 */}
    <GoogleAdSense adSlot={getAdSlot("home", "sidebar") || ""} />
  </>
)}
```

## 🎨 Mode Développement vs Production

### En développement (`npm run dev`)
- Les annonces montrent un **placeholder élégant**
- Texte : "Ad Placeholder (Development Mode)"
- Icône : 📢

### En production (après déploiement)
- Les **vraies annonces AdSense** s'affichent
- Nécessite que votre compte AdSense soit approuvé

## ✅ Checklist Avant de Déployer

- [ ] Remplacer tous les ad slots temporaires par les vrais IDs AdSense
- [ ] Vérifier que `adsConfig.enabled = true`
- [ ] Confirmer que les pages voulues ont `enabled: true`
- [ ] Tester le build : `npm run build`
- [ ] Déployer en production

## 🆘 Support

Si vous avez des questions sur la configuration AdSense :
1. Consultez la [documentation AdSense](https://support.google.com/adsense)
2. Vérifiez les erreurs dans la console du navigateur
3. Assurez-vous que votre compte AdSense est approuvé

---

**Dernière mise à jour :** 29 janvier 2026
