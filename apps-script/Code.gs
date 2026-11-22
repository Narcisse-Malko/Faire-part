/**
 * Reçoit les confirmations de présence du faire-part et les inscrit
 * dans la feuille « Mariage – Confirmations de présence ».
 *
 * Installation : voir apps-script/README.md
 */

const SPREADSHEET_ID = '1tQ1rClNL1xG7f8rty1my779-DuorSv6_obKhO_Q4r_g'
const HEADERS = ['Date de réponse', 'Clé du lien', 'Invité', 'Réponse']

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const data = JSON.parse(e.postData.contents)
    const name = String(data.name || '').trim().slice(0, 120)
    const key = String(data.key || '').trim().toLowerCase().slice(0, 80)
    if (!name) return reply({ ok: false, error: 'Nom manquant' })
    const answer = data.attending ? 'Présent' : 'Absent'

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0]
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === '') {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold')
      sheet.setFrozenRows(1)
    }

    const row = [new Date(), key, name, answer]

    // Un invité nominatif qui change d'avis : on met à jour sa ligne au lieu d'en ajouter une.
    if (key) {
      const last = sheet.getLastRow()
      if (last > 1) {
        const keys = sheet.getRange(2, 2, last - 1, 1).getValues()
        const i = keys.findIndex((r) => r[0] === key)
        if (i !== -1) {
          sheet.getRange(i + 2, 1, 1, row.length).setValues([row])
          return reply({ ok: true, updated: true })
        }
      }
    }

    sheet.appendRow(row)
    return reply({ ok: true })
  } catch (err) {
    return reply({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
