var models = [{
    question: '被套牢的时候你还能待股市如初恋吗？',
    answer1: {
        qtext: '后悔，能逃就逃',
        value: '0'
    },
    answer2: {
        qtext: '还是努力互相适应吧',
        value: '0'
    },
    answer3: {
        qtext: '随便吧，不管了',
        value: '2'
    }
}, {
    question: '你能一眼识别出下面哪组都是2015年的“妖股”吗？',
    answer1: {
        qtext: '全通教育、暴风科技、埃斯顿',
        value: '2'
    },
    answer2: {
        qtext: '龙生股份、万科、乐视股份',
        value: '0'
    },
    answer3: {
        qtext: '莱茵置业、招商银行、安硕信息',
        value: '0'
    },
}, {
    question: '股市前方有“熊”埋伏时，哪些“武器”可能会帮助你增强防御？',
    answer1: {
        qtext: '做空股指期货',
        value: '1'
    },

    answer2: {
        qtext: '分级基金A',
        value: '1'
    },
    answer3: {
        qtext: '以上两个我都需要',
        value: '2'
    }
}, {
    question: '国家队拉大盘的时候，你觉得下面的“攻击”策略，哪个靠谱？',
    answer1: {
        qtext: '提高仓位中的大盘股比例',
        value: '1'
    },

    answer2: {
        qtext: '做多IH、做空IC',
        value: '1'
    },
    answer3: {
        qtext: '以上都可以',
        value: '2'
    }
}, {
    question: '华策影视勾搭上了吸金小王子郭敬明，你觉得该"快狠准"地做点儿什么呢？',

    answer1: {
        qtext: '买入华策影视',
        value: '2'
    },
    answer2: {
        qtext: '卖出华策影视',
        value: '0'
    },
    answer3: {
        qtext: '什么也不做',
        value: '0'
    }
}, {
    question: '关键位置有内情人，才能"招招制胜"，你觉得哪一个组合体现了这一精髓？',

    answer1: {
        qtext: '股东高管增持的股票组合',
        value: '2'
    },
    answer2: {
        qtext: '股价腰斩的股票组合',
        value: '0'
    },
    answer3: {
        qtext: '打新股组合',
        value: '0'
    }
}, ]

function getProfitLevel(profit) {
    console.log(profit)
    if (profit >= 0 && profit < 3) {
        return {
            title: '没错，我就是李小龙双截棍的传人',
            contents: ['你是李氏奇门武器双截棍的传人！', '亦是正直的化身。', '劈、扫、打、抽，变化无穷。', '短小精悍，收放自如，柔中带刚，', '是真正的“护盘侠”！'],
            img: 'result_1.png'
        }
    }
    if (profit >= 3 && profit <= 4) {
        return {
            title: '没错，我就是李小龙长短棍的传人',
            contents: ['你是李小龙长短棍的传人！', '只有反应奇快之人，才能hold住此功。', '棍击之处，令人毛骨耸立，', '看准要害，一击即中，', '保“牛市”之长红。'],
            img: 'result_2.png'
        }
    }
    if (profit >= 5 && profit <= 6) {
        return {
            title: '没错，我就是李小龙匕首的传人',
            contents: ['你是李氏功夫中匕首的传人！', '于掌心处暗藏猎猎杀气，', '红绿纷乱撩人眼，此器锋刃既开，', '却能于无声中击破“十倍股”。'],
            img: 'result_3.png'
        }
    }
    if (profit >= 7 && profit <= 8) {
        return {
            title: '没错，我就是李小龙寸拳的传人',
            contents: ['你是寸拳传人！', '此拳乃李小龙截拳道中的最高技艺，', '只有意志坚强者可习得此拳。', '至简、至灵、至威、至猛，短距出拳，', '能让150公斤的“熊”脏腑爆裂，', '应声倒地！'],
            img: 'result_4.png'
        }
    }
    if (profit >= 9 && profit <= 10) {
        return {
            title: '没错，我就是李小龙勾漏手的传人',
            contents: ['你是李小龙成名绝技勾漏手的传人！', '此技威猛凌厉，', '需保持旺盛的必胜决心，', '沉着护“盘”，不断调整距离，', '灵活走步，诱敌出击。'],
            img: 'result_5.png'
        }
    }
    if (profit >= 11 && profit <= 12) {
        return {
            title: '没错，我就是李小龙咏春的传人',
            contents: ['你传承了李小龙犀利的李三脚！', '该脚法迅猛、灵活、杀伤力大。', '无论是直踢、侧踢、', '后摆腿还是连环三腿，', '都需稳固底“盘”，沉着蓄力！'],
            img: 'result_6.png'
        }
    }
    if (profit >= 13 && profit <= 14) {
        return {
            title: '没错，我就是李小龙击剑的传人',
            contents: ['你传承了李小龙的咏春，', '时也是一代宗师叶问的继承人！', '咏春之精髓不在“攻”而在“止”，', '内止懦、外止暴，', '于“牛熊”激斗前心止如水，', '方能至投资最高境界。'],
            img: 'result_7.png'
        }
    }
    if (profit >= 15) {
        return {
            title: "没错，我就是李小龙双截棍的传人",
            contents: ['你深谙李小龙的剑道，', '此术优雅而灵活，敏捷而无情，', '在刺击时守住底线，', '正是李小龙截拳道的精华——', '于大起大伏中克服贪婪、愤怒与愚昧。'],
            img: 'result_8.png'
        }
    }
}
