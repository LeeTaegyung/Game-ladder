export class CreateLadder {
    constructor(data) {
        this.data = data;
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseClick = this.mouseClick.bind(this);
        this.selectLine;
    }
    draw(userInfo, resultInfo) {
        const me = this.data;
        const ctx = me.ctx;
        const canvas = me.canvas;
        
        ctx.font = '20px sans-serif';
        const smallSquare = ctx.measureText('M').width;
        const resetTxtSize = ctx.measureText('reset').width;
        this.gameReset = {
            txt: 'reset',
            font: '20px sans-serif',
            startX: me.canvasWidth / 2 - (resetTxtSize / 2) - 5,
            startY: me.canvasHeight - smallSquare - 5,
            endX: me.canvasWidth / 2 + resetTxtSize - 5,
            endY: me.canvasHeight + smallSquare - 5,
            txtX: me.canvasWidth / 2,
            txtY: me.canvasHeight - (smallSquare / 2) + 5,
            txtW: resetTxtSize + 10,
            txtH: smallSquare + 10,
        }

        // 텍스트 그리기
        ctx.fillStyle = 'black';
        ctx.font = '20px sans-serif';
        const baseSize = ctx.measureText('M').width;
        this.hoverArea = [];
        for(let i = 0; i < me.personCount; i++) {
            let x = me.defaultGrid.x[i];
            let y1 = me.ladderHeightStart - baseSize;
            let y2 = me.ladderHeightEnd + baseSize;
            let txtWidth = ctx.measureText(userInfo[i]).width;
            
            ctx.fillText(userInfo[i], x, y1);
            ctx.fillText(resultInfo[i], x, y2);

            this.hoverArea.push({
                txt: userInfo[i],
                startX: me.defaultGrid.x[i] - (txtWidth/2),
                startY: y1 - (baseSize/2),
                endX: me.defaultGrid.x[i] + (txtWidth/2),
                endY: y1 + baseSize,
                txtX: x,
                txtY: y1,
                aniActive: false,
            })
            this.hoverArea.push({
                txt: resultInfo[i],
                startX: me.defaultGrid.x[i] - (txtWidth/2),
                startY: y2 - (baseSize/2),
                endX: me.defaultGrid.x[i] + (txtWidth/2),
                endY: y2 + baseSize,
                txtX: x,
                txtY: y2,
                aniActive: false,
            })

        }
        // 게임리셋 버튼 그리기
        ctx.textAlign = "center";
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(this.gameReset.startX, this.gameReset.startY, this.gameReset.txtW, this.gameReset.txtH);
        ctx.fillStyle = '#fff';
        ctx.font = this.gameReset.font;
        ctx.fillText(this.gameReset.txt, this.gameReset.txtX, this.gameReset.txtY);

        me.getMiddleLine();
        me.drawMiddleLine();
        me.getFindLine();
        
        // 마우스 움직일때(hover)
        canvas.addEventListener('mousemove', this.mouseMove);
        // 마우스 클릭할때(click)
        canvas.addEventListener('click', this.mouseClick);

    }

    mouseMove(e) {
        const me = this.data;
        if(!me.animation) {
            const canvas = me.canvas;
            const ctx = me.ctx;
            let x = e.clientX - me.rect.left, // 캔버스 내의 hover를 할 타겟 좌표값X
                y = e.clientY - me.rect.top;// 캔버스 내의 hover를 할 타겟 좌표값Y
            
            canvas.style = 'cursor: default;';
    
            me.clearCanvas(); // 캔버스 초기화
    
            me.drawDefaultLine();
            me.drawMiddleLine();
    
            if(this.selectLine != undefined) { // 기존에 그렸던 라인 보존
                me.ladderAni('static', this.selectLine);
            }
    
            this.hoverArea.forEach(ele => {
                if((ele.startX <= x && ele.endX > x) &&
                    (ele.startY <= y && ele.endY > y)) {
                    ctx.fillStyle = 'red';
                    canvas.style = 'cursor: pointer;';
                } else {
                    ctx.fillStyle = 'black';
                }
                ctx.fillText(ele.txt, ele.txtX, ele.txtY);
            })
            
            // 리셋버튼 그리기
            ctx.fillStyle = '#0000ff';
            ctx.fillRect(this.gameReset.startX, this.gameReset.startY, this.gameReset.txtW, this.gameReset.txtH);
            
            if((this.gameReset.startX <= x && this.gameReset.endX > x) &&
                (this.gameReset.startY <= y && this.gameReset.endY > y)) {
                ctx.fillStyle = 'red';
                me.canvas.style = 'cursor: pointer;';
            } else {
                ctx.fillStyle = '#fff';
            }
            ctx.fillText(this.gameReset.txt, this.gameReset.txtX, this.gameReset.txtY);
        }

        
    }
    mouseClick(e) {
        const me = this.data;
        const canvas = me.canvas;

        if(!me.animation) {
            const canvas = me.canvas;
            const ctx = me.ctx;
            let x = e.clientX - me.rect.left, // 캔버스 내의 hover를 할 타겟 좌표값X
                y = e.clientY - me.rect.top;// 캔버스 내의 hover를 할 타겟 좌표값Y
            
            me.clearCanvas(); // 캔버스 초기화
    
            ctx.strokeStyle = 'black';
            
            me.drawDefaultLine();
            me.drawMiddleLine();
            
    
            this.hoverArea.forEach((ele, idx) => {
                if((ele.startX <= x && ele.endX > x) &&
                    (ele.startY <= y && ele.endY > y)) {
                    
                    ctx.fillStyle = 'red';
                    canvas.style = 'cursor: default;';
                    
                    this.selectLine = idx;
    
                    if(!ele.aniActive) {
                        ele.aniActive = true; // 선택한 번호가 애니메이션이 진행되었는지 확인.
                        me.ladderAni(me.animationType, this.selectLine);
                    } else {
                        me.ladderAni('static', this.selectLine);
                    }
    
                } else {
                    ctx.fillStyle = 'black';
                }
                ctx.fillText(ele.txt, ele.txtX, ele.txtY);
    
            })

            // 리셋버튼 그리기
            ctx.fillStyle = '#0000ff';
            ctx.fillRect(this.gameReset.startX, this.gameReset.startY, this.gameReset.txtW, this.gameReset.txtH);
            
            if((this.gameReset.startX <= x && this.gameReset.endX > x) &&
                (this.gameReset.startY <= y && this.gameReset.endY > y)) {
                ctx.fillStyle = 'red';
                me.canvas.style = 'cursor: pointer;';
                // 마우스 움직일때(hover)
                canvas.removeEventListener('mousemove', this.mouseMove);
                // 마우스 클릭할때(click)
                canvas.removeEventListener('click', this.mouseClick);
                me.reset();
                return;
            } else {
                ctx.fillStyle = '#fff';
            }
            ctx.fillText(this.gameReset.txt, this.gameReset.txtX, this.gameReset.txtY);
        }

    }
}