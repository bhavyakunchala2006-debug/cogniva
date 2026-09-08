// ============================================================
// COGNIVA — NER Cultural Content Database
// ============================================================
// This is the seeded content database for North Eastern Region
// of India. Categories: food, clothing, festivals, household
// objects, etc. Add content per state.
// ============================================================

import type { CulturalContent } from '@/types/cultural.types'

export const NER_CULTURAL_CONTENT: CulturalContent[] = [
  // ── ASSAM ─────────────────────────────────────────────────
  {
    contentId: 'as-food-001',
    state: 'Assam',
    region: 'Assam',
    languages: ['en', 'hi', 'as'],
    category: 'food',
    contentType: 'emoji',
    name: { en: 'Rice', hi: 'चावल', as: 'চাউল' },
    description: { en: 'Staple food of Assam', hi: 'असम का मुख्य भोजन' },
    tags: ['rice', 'food', 'assam', 'staple'],
    emoji: '🍚',
    approved: true,
  },
  {
    contentId: 'as-food-002',
    state: 'Assam',
    region: 'Assam',
    languages: ['en', 'hi', 'as'],
    category: 'food',
    contentType: 'emoji',
    name: { en: 'Fish', hi: 'मछली', as: 'মাছ' },
    description: { en: 'Fresh river fish - an Assamese staple', hi: 'ताजी नदी की मछली' },
    tags: ['fish', 'food', 'assam', 'river'],
    emoji: '🐟',
    approved: true,
  },
  {
    contentId: 'as-food-003',
    state: 'Assam',
    region: 'Assam',
    languages: ['en', 'hi', 'as'],
    category: 'food',
    contentType: 'emoji',
    name: { en: 'Tea', hi: 'चाय', as: 'চাহ' },
    description: { en: 'Famous Assam tea', hi: 'प्रसिद्ध असम चाय' },
    tags: ['tea', 'food', 'assam'],
    emoji: '🍵',
    approved: true,
  },
  {
    contentId: 'as-festival-001',
    state: 'Assam',
    region: 'Assam',
    languages: ['en', 'hi', 'as'],
    category: 'festivals',
    contentType: 'emoji',
    name: { en: 'Bihu', hi: 'बिहू', as: 'বিহু' },
    description: { en: 'Assam\'s harvest festival', hi: 'असम का फसल उत्सव' },
    tags: ['bihu', 'festival', 'assam', 'harvest'],
    emoji: '🎉',
    approved: true,
  },
  {
    contentId: 'as-nature-001',
    state: 'Assam',
    region: 'Assam',
    languages: ['en', 'hi', 'as'],
    category: 'nature',
    contentType: 'emoji',
    name: { en: 'Elephant', hi: 'हाथी', as: 'হাতী' },
    description: { en: 'Indian elephant, symbol of Assam', hi: 'असम का प्रतीक हाथी' },
    tags: ['elephant', 'nature', 'assam', 'animal'],
    emoji: '🐘',
    approved: true,
  },
  {
    contentId: 'as-nature-002',
    state: 'Assam',
    region: 'Assam',
    languages: ['en', 'hi', 'as'],
    category: 'nature',
    contentType: 'emoji',
    name: { en: 'Brahmaputra River', hi: 'ब्रह्मपुत्र नदी', as: 'ব্ৰহ্মপুত্ৰ' },
    description: { en: 'Mighty Brahmaputra river of Assam', hi: 'असम की महान ब्रह्मपुत्र नदी' },
    tags: ['river', 'brahmaputra', 'assam', 'nature'],
    emoji: '🌊',
    approved: true,
  },
  {
    contentId: 'as-household-001',
    state: 'Assam',
    region: 'Assam',
    languages: ['en', 'hi', 'as'],
    category: 'householdObjects',
    contentType: 'emoji',
    name: { en: 'Brass Pot', hi: 'पीतल का बर्तन', as: 'পিতলৰ বাচন' },
    description: { en: 'Traditional brass vessel used in Assamese homes', hi: 'असमी घरों में प्रयुक्त पारंपरिक पीतल का बर्तन' },
    tags: ['brass', 'pot', 'household', 'assam', 'traditional'],
    emoji: '🫙',
    approved: true,
  },

  // ── MEGHALAYA ────────────────────────────────────────────
  {
    contentId: 'ml-food-001',
    state: 'Meghalaya',
    region: 'Meghalaya',
    languages: ['en', 'hi'],
    category: 'food',
    contentType: 'emoji',
    name: { en: 'Bamboo Shoot', hi: 'बाँस की कोंपल' },
    description: { en: 'Bamboo shoots used in Khasi cuisine', hi: 'खासी व्यंजन में उपयोग' },
    tags: ['bamboo', 'food', 'meghalaya', 'khasi'],
    emoji: '🎋',
    approved: true,
  },
  {
    contentId: 'ml-nature-001',
    state: 'Meghalaya',
    region: 'Meghalaya',
    languages: ['en', 'hi'],
    category: 'nature',
    contentType: 'emoji',
    name: { en: 'Rain Cloud', hi: 'बादल' },
    description: { en: 'Meghalaya — abode of clouds', hi: 'मेघालय — बादलों का घर' },
    tags: ['rain', 'cloud', 'meghalaya', 'nature'],
    emoji: '⛅',
    approved: true,
  },
  {
    contentId: 'ml-festival-001',
    state: 'Meghalaya',
    region: 'Meghalaya',
    languages: ['en', 'hi'],
    category: 'festivals',
    contentType: 'emoji',
    name: { en: 'Nongkrem Dance', hi: 'नोंगक्रेम नृत्य' },
    description: { en: 'Sacred Khasi harvest festival', hi: 'पवित्र खासी फसल उत्सव' },
    tags: ['nongkrem', 'festival', 'meghalaya', 'dance', 'khasi'],
    emoji: '💃',
    approved: true,
  },

  // ── MANIPUR ──────────────────────────────────────────────
  {
    contentId: 'mn-food-001',
    state: 'Manipur',
    region: 'Manipur',
    languages: ['en', 'hi', 'mni'],
    category: 'food',
    contentType: 'emoji',
    name: { en: 'Kangshoi', hi: 'कांगशोई', mni: 'কাংশোই' },
    description: { en: 'Manipuri vegetable stew', hi: 'मणिपुरी सब्जी का स्टू' },
    tags: ['kangshoi', 'food', 'manipur', 'stew'],
    emoji: '🥘',
    approved: true,
  },
  {
    contentId: 'mn-festival-001',
    state: 'Manipur',
    region: 'Manipur',
    languages: ['en', 'hi', 'mni'],
    category: 'festivals',
    contentType: 'emoji',
    name: { en: 'Yaoshang', hi: 'याओशांग', mni: 'য়াওশাং' },
    description: { en: 'Manipuri Holi-like spring festival', hi: 'मणिपुरी होली जैसा वसंत उत्सव' },
    tags: ['yaoshang', 'festival', 'manipur', 'spring'],
    emoji: '🌸',
    approved: true,
  },
  {
    contentId: 'mn-clothing-001',
    state: 'Manipur',
    region: 'Manipur',
    languages: ['en', 'hi', 'mni'],
    category: 'clothing',
    contentType: 'emoji',
    name: { en: 'Phanek', hi: 'फानेक', mni: 'ফানেক' },
    description: { en: 'Traditional Manipuri women\'s wraparound skirt', hi: 'मणिपुरी महिलाओं की पारंपरिक लुंगी' },
    tags: ['phanek', 'clothing', 'manipur', 'traditional'],
    emoji: '👗',
    approved: true,
  },

  // ── NAGALAND ─────────────────────────────────────────────
  {
    contentId: 'nl-festival-001',
    state: 'Nagaland',
    region: 'Nagaland',
    languages: ['en', 'hi'],
    category: 'festivals',
    contentType: 'emoji',
    name: { en: 'Hornbill Festival', hi: 'हॉर्नबिल उत्सव' },
    description: { en: 'Nagaland\'s festival of festivals', hi: 'नागालैंड का महोत्सव' },
    tags: ['hornbill', 'festival', 'nagaland'],
    emoji: '🦜',
    approved: true,
  },
  {
    contentId: 'nl-food-001',
    state: 'Nagaland',
    region: 'Nagaland',
    languages: ['en', 'hi'],
    category: 'food',
    contentType: 'emoji',
    name: { en: 'Smoked Meat', hi: 'धुँआ मांस' },
    description: { en: 'Traditional smoked pork of Nagaland', hi: 'नागालैंड का पारंपरिक धुँआ सूअर' },
    tags: ['smoked', 'meat', 'food', 'nagaland'],
    emoji: '🍖',
    approved: true,
  },

  // ── GENERAL (NER COMMON) ──────────────────────────────
  {
    contentId: 'gen-household-001',
    state: 'General',
    region: 'NER',
    languages: ['en', 'hi'],
    category: 'householdObjects',
    contentType: 'emoji',
    name: { en: 'Lamp', hi: 'दीपक' },
    description: { en: 'Traditional oil lamp', hi: 'पारंपरिक तेल का दीपक' },
    tags: ['lamp', 'household', 'traditional', 'light'],
    emoji: '🪔',
    approved: true,
  },
  {
    contentId: 'gen-nature-001',
    state: 'General',
    region: 'NER',
    languages: ['en', 'hi'],
    category: 'nature',
    contentType: 'emoji',
    name: { en: 'Mountain', hi: 'पहाड़' },
    description: { en: 'The hills and mountains of Northeast India', hi: 'पूर्वोत्तर भारत के पहाड़' },
    tags: ['mountain', 'hills', 'nature', 'ner'],
    emoji: '⛰️',
    approved: true,
  },
  {
    contentId: 'gen-daily-001',
    state: 'General',
    region: 'NER',
    languages: ['en', 'hi'],
    category: 'dailyActivities',
    contentType: 'emoji',
    name: { en: 'Cooking', hi: 'खाना बनाना' },
    description: { en: 'Preparing traditional meals', hi: 'पारंपरिक भोजन बनाना' },
    tags: ['cooking', 'daily', 'activity', 'food'],
    emoji: '👨‍🍳',
    approved: true,
  },
  {
    contentId: 'gen-daily-002',
    state: 'General',
    region: 'NER',
    languages: ['en', 'hi'],
    category: 'dailyActivities',
    contentType: 'emoji',
    name: { en: 'Farming', hi: 'खेती' },
    description: { en: 'Traditional farming activity', hi: 'पारंपरिक खेती की गतिविधि' },
    tags: ['farming', 'daily', 'activity', 'agriculture'],
    emoji: '🌾',
    approved: true,
  },
  {
    contentId: 'gen-nature-002',
    state: 'General',
    region: 'NER',
    languages: ['en', 'hi'],
    category: 'nature',
    contentType: 'emoji',
    name: { en: 'Bamboo', hi: 'बाँस' },
    description: { en: 'Bamboo — vital plant of Northeast India', hi: 'बाँस — पूर्वोत्तर भारत का महत्वपूर्ण पौधा' },
    tags: ['bamboo', 'nature', 'ner', 'plant'],
    emoji: '🎋',
    approved: true,
  },
  {
    contentId: 'gen-community-001',
    state: 'General',
    region: 'NER',
    languages: ['en', 'hi'],
    category: 'communityActivities',
    contentType: 'emoji',
    name: { en: 'Community Gathering', hi: 'सामुदायिक बैठक' },
    description: { en: 'Village community gatherings', hi: 'गाँव की सामुदायिक बैठक' },
    tags: ['community', 'gathering', 'village', 'social'],
    emoji: '👥',
    approved: true,
  },
  {
    contentId: 'gen-household-002',
    state: 'General',
    region: 'NER',
    languages: ['en', 'hi'],
    category: 'householdObjects',
    contentType: 'emoji',
    name: { en: 'Wicker Basket', hi: 'बाँस की टोकरी' },
    description: { en: 'Traditional bamboo basket used in NER homes', hi: 'पूर्वोत्तर के घरों में बाँस की टोकरी' },
    tags: ['basket', 'bamboo', 'household', 'traditional'],
    emoji: '🧺',
    approved: true,
  },
  {
    contentId: 'gen-clothing-001',
    state: 'General',
    region: 'NER',
    languages: ['en', 'hi'],
    category: 'clothing',
    contentType: 'emoji',
    name: { en: 'Traditional Shawl', hi: 'पारंपरिक शाल' },
    description: { en: 'Handwoven traditional shawl of NER', hi: 'पूर्वोत्तर की हाथ से बुनी शाल' },
    tags: ['shawl', 'clothing', 'traditional', 'weaving'],
    emoji: '🧣',
    approved: true,
  },
]

// Helper to get content by state and/or category
export function getCulturalContent(
  state?: string,
  category?: string,
  limit?: number
): CulturalContent[] {
  let filtered = NER_CULTURAL_CONTENT.filter((c) => c.approved)
  if (state && state !== 'General') {
    filtered = filtered.filter((c) => c.state === state || c.state === 'General')
  }
  if (category) {
    filtered = filtered.filter((c) => c.category === category)
  }
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  return filtered
}

export interface NERItem {
  id: string
  name: string
  emoji?: string
  category: string
  culturalTag: string
  description?: string
}

// Get as game items
export function getCulturalGameItems(
  state?: string,
  category?: string,
  count: number = 8
): NERItem[] {
  const content = getCulturalContent(state, category, count * 2)
  const shuffled = content.sort(() => Math.random() - 0.5).slice(0, count)
  return shuffled.map((c) => ({
    id: c.contentId,
    name: c.name.en,
    emoji: c.emoji || '🖼️',
    category: c.category,
    culturalTag: c.state,
    description: c.description?.en || c.name.en,
  }))
}
