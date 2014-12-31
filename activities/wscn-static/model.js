var models = [
    {type:'商品',score:2,profit4choice1:-1638,profit4choice2:1638,qText1:'做多黄金',qText2:'做空黄金',title:'耶伦讲话后黄金跌幅扩大至2%'},
    {type:'商品',score:2,profit4choice1:1500,profit4choice2:-1500,qText1:'做多可可豆期货',qText2:'做空可可豆期货',title:'致命病毒侵非洲'},
    {type:'外汇',score:3.3,profit4choice1:-1335,profit4choice2:1335,qText1:'做多澳元',qText2:'做空澳元',title:'汇丰12月中国制造业'},
    {type:'商品',score:2,profit4choice1:940,profit4choice2:-940,qText1:'做多咖啡期货',qText2:'做空咖啡期货',title:'干旱开始'},
    {type:'商品',score:2,profit4choice1:-1400,profit4choice2:1400,qText1:'做多石油',qText2:'做空石油',title:'OPEC称不减产石油'},

    {type:'股票',score:5,profit4choice1:2063,profit4choice2:0,qText1:'买A股',qText2:'什么也不做',title:'降息：上证指数'},
    {type:'股票',score:5,profit4choice1:941,profit4choice2:0,qText1:'买伊利股份',qText2:'什么也不做',title:'二胎概念伊利股份'},
    {type:'外汇',score:3.3,profit4choice1:1200,profit4choice2:-1200,qText1:'做多美元指数',qText2:'做空美元指数',title:'美国每个月周五会公布就业数据，某月的数据新增就业28.8万人，较预期高7万人之多'},

    {type:'外汇',score:3.3,profit4choice1:1200,profit4choice2:-1200,qText1:'做多美元兑卢布',qText2:'做空美元兑卢布',title:'原油暴跌买卖卢布'},
    {type:'债券',score:10,profit4choice1:-810,profit4choice2:810,qText1:'买入西班牙国债',qText2:'卖出西班牙国债',title:'苏格兰宣布将公以决定是否脱离英国独立。人们担心公投结果会鼓舞西班牙的民族分裂情绪。 您的投资决策选择？'},
    {type:'商品',score:2,profit4choice1:2589,profit4choice2:-2589,qText1:'做多石油',qText2:'做空石油',title:'输油管爆炸'}
]

function getProfitLevel(profit){
    if(profit>=15616){
        return {
            title : '你的投资第七感小宇宙快要爆棚了！ 2015年的全球首富很可能就是你！',
            img:'result_1.png',width:132,height:105
        }
    }
    if(profit>7100){
        return {
            title:'你的才华亮瞎了巴菲特，2015年躁起来~ 快解锁天赋技能！',
            img:'result_2.png',width:72,height:76
        }
    }
    if(profit>4100){
        return{
            title:'这样的技能，堪称投资界学婊。赏你一本《玉女投资心经》'
        }
    }
    if(profit>1400){
        return {
            title:'哎哟收益很不错哦，天份值萌萌哒~2015年别再让自己关灯吃面了啦',
            img:'result_4.png',width:58,height:84
        }
    }
    if(profit>700){
        return {
            title:'轻松碾压余额宝，这舒爽，简直停不下来~  马云：说不出的囧'
        }
    }
    if(profit>=330){
        return {
            title:'有钱就任性，浪费大好天赋，作得一手好死， 2015年好好玩儿行嘛？'
        }
    }
    if(profit>=0){
        return {
            title:'你和金钱的关系太纯洁，骚年，不装逼还是朋友~，让爷教你如何扑倒它！'
        }
    }
    if(profit > -2100){
        return {
            title:"心塞塞的，辣条都吃不上的节奏。命理大师说2015年是屌丝逆袭年……不拼不形了！"
        }
    }
    if(profit > -4500){
        return{
            title:'多么痛的领悟...投资对你来说果真是世界上最残（you)酷(ai)的运动，小龙女牌叉烧包，爷赏你了',
            img:'result_9.png',width:73,height:72
        }
    }
    if(profit > -6600){
        return{
            title:'你一投资，狗血堪比琼瑶剧，特效更胜好莱坞，全球只剩没几个人为你垫底了，2015年不涨姿势不行啊'
        }
    }
    if(profit <6600){
        return {
            title:'刚为你申请了一项吉尼斯世界记录——世界上最蠢萌的投资大脑，去领奖，不谢。不做广告不行：你绝对要下载华尔街见闻App！'
        }
    }
}
var stat = {
    scoreGroup:{
        '股票':{score:0,total:10},
        '外汇':{score:0,total:10},
        '商品':{score:0,total:10},
        '债券':{score:0,total:10}
    },
    profit:[]
}
//for(var i in stat.scoreGroup){
//    stat.scoreGroup[i].score=Math.random()*10;
//}