// JavaScript Document

function select()
{
var x = [28];
x[0]="";
x[1]="北京,北京";
x[2]="上海,上海";
x[3]="天津,天津";
x[4]="重庆,重庆";
x[5]="邯郸,保定,唐山";
x[6]="山西";
x[7]="沈阳,大连";
x[8]="长春";
x[9]="哈尔滨";
x[10]="南京,苏州,南通,扬州,盐城,常州,无锡";
x[11]="杭州,宁波,温州,嘉兴,绍兴,义乌,台州";
x[12]="合肥,芜湖";
x[13]="福州,厦门,泉州";
x[14]="南昌";
x[15]="济南,青岛,潍坊";
x[16]="郑州";
x[17]="武汉,襄阳";
x[18]="长沙";
x[19]="广州,深圳,东莞,中山,佛山";
x[20]="南宁";
x[21]="海口";
x[22]="成都,绵阳,南充,宜宾,泸州";
x[23]="贵阳";
x[24]="昆明";
x[25]="西安,榆林";
x[26]="兰州";
x[27]="银川";
x[28]="乌鲁木齐";

var citys=x[document.getElementById("Province").value].split(",");
var obj = document.getElementById('City').options.length = 0;
for(var i=0;i<citys.length;i++)
document.getElementById("City").options[i]=new Option(citys[i],citys[i]);

  
var provinces=",北京,上海,天津,重庆,河北,山西,辽宁,吉林,黑龙江,江苏,浙江,安徽,福建,江西,山东,河南,湖北,湖南,广东,广西,海南,四川,贵州,云南,陕西,甘肃,宁夏,新疆,";
var province = provinces.split(",");

}
