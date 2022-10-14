import { Counter } from "./counter.js";

export class Ladder {
    
    constructor(target, opt) {
        this.target = document.querySelector(target);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.target.appendChild(this.canvas);
        
        this.canvasWidth = opt.canvasWidth || 580;
        this.canvasHeight = opt.canvasHeight || 320;
        
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        this.rect = this.canvas.getBoundingClientRect();

        this.marginOut = opt.marginOut || 60; // 사다리영역 밖 좌우상하여백
        this.marginIn = opt.marginIn || 20; // 사다리영역 안 상하여백
        this.ladderWidthStart = this.marginOut; // 사다리 넓이 시작 좌표
        this.ladderWidthEnd = this.canvasWidth - this.marginOut; // 사다리 넓이 끝 좌표
        this.ladderWidth = this.ladderWidthEnd - this.ladderWidthStart; // 사다리 실제 넓이 크기
        this.ladderHeightStart = this.marginOut; // 사다리 높이 시작 좌표
        this.ladderHeightEnd = this.canvasHeight - this.marginOut; // 사다리 높이 끝 좌표
        this.ladderHeight = this.ladderHeightEnd - this.ladderHeightStart; // 사다리 실제 높이 크기
        this.gridPer = opt.gridPer || 10; // y축 점당 간격
        this.middleLineMin = opt.middleLineMin || 4; // 중간 라인 최소 개수
        this.middleLineMax = opt.middleLineMax || 6; // 중간 라인 최대 개수

        this.personCount = 5; // 참가자수
        this.maxPersonCount = opt.maxPersonCount || 8; // 최대 참가자수

        this.animation = false;
        this.animationType = opt.animationType || 'action';

        this.lineColor = [];

        this.init();
    }

    init() {
        this.counter = new Counter(this);
        this.counter.draw();
    }

    reset() {
        this.personCount = 5; // 참여자수 초기화
        this.clearCanvas();
        this.counter.draw();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    getDefaultGrid() {
        let lineDistance = this.ladderWidth / (this.personCount - 1);

        this.defaultGrid = { x: [], y: [] };
        // 기본 좌표 x값 입력
        for(let Line = 0; Line < this.personCount; Line++) {
            let x = Math.floor(Line * lineDistance + this.marginOut);
            this.defaultGrid.x.push(x);
        }
        // 기본 좌표 y값 입력
        const dotCount = Math.floor((this.ladderHeight - (this.marginIn * 2)) / this.gridPer); // y축 per당 개수
        for(let dot = 0; dot <= dotCount; dot++) {
            this.defaultGrid.y.push(Math.floor(dot * this.gridPer + this.marginOut + this.marginIn));
        }
    }

    drawDefaultLine() {
        // 기본 라인 그리기
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'black';
        for(let i = 0; i < this.personCount; i++) {
            let x = this.defaultGrid.x[i];
            let y1 = this.ladderHeightStart;
            let y2 = this.ladderHeightEnd;
            this.ctx.moveTo(x, y1);
            this.ctx.lineTo(x, y2);
        }
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    getMiddleLine() {
        // 중간 점 구해서 배열에 저장
        this.selectGrid = [];
        for(let line = 0; line < this.personCount - 1; line++) {
            let lineCount = Math.floor(Math.random() * (this.middleLineMax - this.middleLineMin)) + this.middleLineMin; // 한줄 당 몇개의 점을 만들지 랜덤
            for(let a = 0; a < lineCount; a++) {
                let pickNum = Math.floor(Math.random() * this.defaultGrid.y.length); // 좌표에 있는 랜덤한 y값 가져옴
                let dupleFilterPrev = this.selectGrid.filter(ele => { return ele.startX === this.defaultGrid.x[line-1] });
                let dubleCheckPrev = dupleFilterPrev.findIndex(ele => { return ele.endY === this.defaultGrid.y[pickNum]});
                let dupleFilterNow = this.selectGrid.filter(ele => { return ele.startX === this.defaultGrid.x[line] });
                let dubleCheckNow = dupleFilterNow.findIndex(ele => { return ele.endY === this.defaultGrid.y[pickNum]});
                if(line === 0) { //첫번째 라인 일때
                    if(dubleCheckNow === -1) {
                        this.selectGrid.push({
                            startX: this.defaultGrid.x[line], 
                            startY: this.defaultGrid.y[pickNum], 
                            endX: this.defaultGrid.x[line+1], 
                            endY: this.defaultGrid.y[pickNum]
                        });
                    }
                    else {
                        a--;
                    }

                } else { // 첫번째 라인 아닐때
                    //이전 줄과 현재줄 값이 중복으로 들어가는지 확인 확인

                    if(dubleCheckPrev === -1 && dubleCheckNow === -1) {
                        this.selectGrid.push({
                            startX: this.defaultGrid.x[line], 
                            startY: this.defaultGrid.y[pickNum], 
                            endX: this.defaultGrid.x[line+1], 
                            endY: this.defaultGrid.y[pickNum]
                        });
                    } else {
                        a--;
                    }
                }
            }

        }
    }

    drawMiddleLine() {
        // 중간 라인 그리기
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'black';
        for(let i = 0; i < this.selectGrid.length; i++) {
            let startX = this.selectGrid[i].startX;
            let startY = this.selectGrid[i].startY;
            let endX = this.selectGrid[i].endX;
            let endY = this.selectGrid[i].endY;
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
        }
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }
    
    getFindLine() {
        // 라인 찾기 데이터 수집
        this.lineData = [];
        for(let line = 0; line < this.personCount * 2; line++) {
            let startLine = this.defaultGrid.x[parseInt(line/2)];
            this.lineData[line] ? this.lineData[line] : this.lineData[line] = [];
            
            if(line%2) {
                // 홀수일경우
                this.lineData[line].push([startLine, this.ladderHeightEnd]);
                
                for(let y = this.ladderHeightEnd; y >= this.ladderHeightStart; y--) {
                    this.selectGrid.forEach(ele => {
                        if(ele.startX === startLine && ele.startY === y) {
                            this.lineData[line].push([startLine, y]);
                            this.lineData[line].push([ele.endX, ele.endY]);
                            startLine = ele.endX;
                        } else if(ele.endX === startLine && ele.endY === y) {
                            this.lineData[line].push([startLine, y]);
                            this.lineData[line].push([ele.startX, ele.startY]);
                            startLine = ele.startX;
                        }
                    })

                    // 끝지점 넣어주기
                    if(y === this.ladderHeightStart) this.lineData[line].push([startLine, this.ladderHeightStart]);
                }
            } else {
                // 짝수일경우
                this.lineData[line].push([startLine, this.ladderHeightStart]); // 시작지점 입력

                for(let y = this.ladderHeightStart; y <= this.ladderHeightEnd; y++) {
                    
                    this.selectGrid.forEach(ele => {
                        if(ele.startX === startLine && ele.startY === y) {
                            this.lineData[line].push([startLine, y]);
                            this.lineData[line].push([ele.endX, ele.endY]);
                            startLine = ele.endX;
                        } else if(ele.endX === startLine && ele.endY === y) {
                            this.lineData[line].push([startLine, y]);
                            this.lineData[line].push([ele.startX, ele.startY]);
                            startLine = ele.startX;
                        }
                    })

                    // 끝지점 넣어주기
                    if(y === this.ladderHeightEnd) this.lineData[line].push([startLine, this.ladderHeightEnd]);
                }

            }
        }
    }

    ladderAni(animationType, lineNum) {
        // 사다리 애니메이션
        this.animation = true;
        const me = this;
        const ctx = this.ctx;

        let animation = {
            // all: function(){
            //     for(let i = 0; i < me.lineData.length; i++) {
            //         ctx.beginPath();
            //         for(let a = 0; a < me.lineData[i].length; a++) {
            //             ctx.moveTo(me.lineData[i][a][0], me.lineData[i][a][1]);
            //             if(me.lineData[i][a+1] !== undefined) {
            //                 ctx.lineTo(me.lineData[i][a+1][0], me.lineData[i][a+1][1]);
            //             }
            //         }
            //         ctx.lineCap = 'round';
            //         ctx.lineJoin = 'round';
            //         ctx.lineWidth = 3;
            //         ctx.strokeStyle =  me.lineColor[i];
            //         ctx.stroke();
            //         ctx.closePath();
            //     }
            // },
            static: function(line) {
                ctx.beginPath();
                for(let a = 0; a < me.lineData[line].length; a++) {
                    ctx.moveTo(me.lineData[line][a][0], me.lineData[line][a][1]);
                    if(me.lineData[line][a+1] !== undefined) {
                        ctx.lineTo(me.lineData[line][a+1][0], me.lineData[line][a+1][1]);
                    }
                }
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 3;
                ctx.strokeStyle = me.lineColor[line];
                ctx.stroke();
                ctx.closePath();
                me.animation = false;
            },
            action: function(line) {
                let step = 0;
                let startX = me.lineData[line][step][0];
                let startY = me.lineData[line][step][1];
                let endX = me.lineData[line][step+1][0];
                let endY = me.lineData[line][step+1][1];
                let x = startX;
                let y = startY;

                // 라인 애니메이션
                let aniId = setInterval(() => {
                    ctx.beginPath();

                    if(y < endY) {
                        y++;
                    } else if(y > endY) {
                        y--;
                    }
                    
                    if(x < endX) {
                        x++;
                    } else if(x > endX) {
                        x--;
                    }
                    if(y === endY && x === endX) {
                        step++;
                        if(me.lineData[line][step+1] !== undefined) {
                            ctx.moveTo(me.lineData[line][step][0], me.lineData[line][step][1]);
                            endX = me.lineData[line][step+1][0];
                            endY = me.lineData[line][step+1][1];
                        }
                    }
                    
                    ctx.lineTo(x, y);

                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = me.lineColor[line];
                    ctx.stroke();
                    ctx.closePath();

                    // 끝에 도달하면 라인 그리고 애니메이션 중지
                    if(me.lineData[line][step+1] === undefined) {
                        clearInterval(aniId);
                        me.animation = false;
                    }

                }, 0.1);
                
            },
        }
        animation[animationType](lineNum);

    }

}
