// api/confirm.js
const { Client } = require('@notionhq/client');

const notion = new Client({ 
  auth: process.env.NOTION_TOKEN 
});

module.exports = async (req, res) => {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { name, willAttend, hasCompanion, mainGuestDiets, companions, message } = req.body;

    // Validaciones básicas
    if (!name) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    // Preparar datos para Notion
    const companionNames = companions.map(c => c.name).join(', ');
    const companionDiets = companions.map(c => `${c.name}: ${c.diets.join(', ')}`).join('; ');

    // Crear página en Notion
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        'Nombre': {
          title: [
            {
              text: {
                content: name
              }
            }
          ]
        },
        'Asistencia': {
          select: {
            name: willAttend ? 'Sí' : 'No'
          }
        },
        'Acompañantes': {
          rich_text: [
            {
              text: {
                content: hasCompanion ? companionNames : 'Ninguno'
              }
            }
          ]
        },
        'Preferencias Alimentarias': {
          rich_text: [
            {
              text: {
                content: mainGuestDiets.join(', ')
              }
            }
          ]
        },
        'Preferencias Acompañantes': {
          rich_text: [
            {
              text: {
                content: companionDiets || 'Ninguna'
              }
            }
          ]
        },
        'Mensaje': {
          rich_text: [
            {
              text: {
                content: message || 'Sin mensaje'
              }
            }
          ]
        },
        'Fecha de Confirmación': {
          date: {
            start: new Date().toISOString().split('T')[0]
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Confirmación guardada exitosamente en Notion',
      id: response.id
    });

  } catch (error) {
    console.error('Error al guardar en Notion:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al guardar en Notion'
    });
  }
};