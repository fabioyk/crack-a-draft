import { Injectable } from '@angular/core';
import { IFormat } from "app/format";

var availableFormats:string[] = ['C03C03C03', 'C00C00C00', 'C04C04C04', 'C11C11C11', 'HOUHOUAKH',
  'AKHAKHAKH', 'MM3MM3MM3', 'AERAERKLD', 'KLDKLDKLD', 'EMAEMAEMA',
  'EMNEMNSOI', 'SOISOISOI', 'OGWOGWBFZ', 'BFZBFZBFZ', 'ORIORIORI',
  'MM2MM2MM2', 'DTKDTKFRF', 'FRFKTKKTK', 'KTKKTKKTK', 'M15M15M15',
  'VMAVMAVMA', 'JOUBNGTHS', 'BNGTHSTHS', 'THSTHSTHS', 'M14M14M14',
  'MMAMMAMMA', 'DGMGTCRTR', 'GTCGTCGTC', 'RTRRTRRTR', 'M13M13M13',
  'AVRAVRAVR', 'DKAISDISD', 'ISDISDISD', 'M12M12M12', 'NPHMBSSOM',
  'MBSSOMSOM', 'SOMSOMSOM', 'M11M11M11', 'ROEROEROE', 'ZENZENWWK',
  'ZENZENZEN', 'M10M10M10', 'ALACONARB', 'ALAALACON', 'ALAALAALA',
  'SHMSHMEVE', 'SHMSHMSHM', 'LRWLRWMOR', 'LRWLRWLRW', '10E10E10E',
  'TSPPLCFUT', 'TSPTSPPLC', 'TSPTSPTSP', 'CSPCSPCSP', 'RAVGPTDIS',
  'RAVRAVGPT', 'RAVRAVRAV', '9ED9ED9ED', 'CHKBOKSOK', 'CHKCHKBOK',
  'CHKCHKCHK', 'MRDDST5DN', 'MRDMRDDST', 'MRDMRDMRD', '8ED8ED8ED',
  'ONSLGNSCG', 'ONSONSLGN', 'ONSONSONS', 'ODYTORJUD', 'ODYODYTOR',
  'ODYODYODY', '7ED7ED7ED', 'INVPLSAPC', 'INVINVPLS', 'INVINVINV',
  'MMQNMSPCY', 'MMQMMQNMS', 'MMQMMQMMQ', '6ED6ED6ED', 'USGUSLUSD',
  'USGUSGUSL', 'USGUSGUSG', 'TMPSTHEXO', 'TMPTMPSTH', 'TMPTMPTMP',
  '5ED5ED5ED', 'MIRVISWTH', 'MIRMIRVIS', 'MIRMIRMIR', 'ME4ME4ME4',
  'ME3ME3ME3', 'ME2ME2ME2', 'MEDMEDMED'];

@Injectable()
export class UtilsService {
  constructor() { }

  calculatePackPickString(pickNumber:number):string {    
    var pack = Math.floor(pickNumber / 15) + 1;
    var pick = pickNumber % 15 + 1;

    return 'Pack ' + pack + ' Pick ' + pick;
  }

  formatDate(date:Date) {
    let day = date.getDate() + 1;
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let stringDay = '';
    if (day < 10) {
      stringDay = '0' + day;
    } else {
      stringDay = day.toString();
    }

    let stringMonth = '';
    if (month < 10) {
      stringMonth = '0' + month;
    } else {
      stringMonth = month.toString();
    }

    return stringMonth + '/' + stringDay + '/' + year;
  }

  sortFormatList(a:IFormat, b:IFormat):number {
    if (availableFormats.indexOf(a.mtgoName) === -1) {
      return 1;
    }
    if (availableFormats.indexOf(b.mtgoName) === -1) {
      return -1;
    }
    return availableFormats.indexOf(a.mtgoName) - availableFormats.indexOf(b.mtgoName);
  }
}
