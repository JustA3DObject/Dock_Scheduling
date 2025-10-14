let currentTutorialStep = 1;
        const totalTutorialSteps = 6;
        let tutorialActive = false;
        
        function checkFirstVisit() {
            if (!localStorage.getItem('berthTutorialCompleted')) {
                setTimeout(() => {
                    startTutorial();
                }, 1000);
            }
        }
        
        function startTutorial() {
            tutorialActive = true;
            currentTutorialStep = 1;
            
            const overlay = document.getElementById('tutorial-overlay');
            const tutorialCard = overlay.querySelector('.tutorial-card');
            
            tutorialCard.classList.remove('visible');
            document.getElementById('tutorial-highlight-box').classList.remove('visible');
        
            overlay.classList.remove('modal-hidden');
            overlay.style.display = 'block';
            overlay.style.opacity = 1;
        
            updateTutorialStep();
        }
        
        function closeTutorial() {
            tutorialActive = false;
            const overlay = document.getElementById('tutorial-overlay');
            
            overlay.style.opacity = 0;
            
            setTimeout(() => {
                overlay.style.display = 'none';
                overlay.classList.add('modal-hidden');
            }, 300);
            
            localStorage.setItem('berthTutorialCompleted', 'true');
        }
        
        function updateTutorialStep() {
            for (let i = 1; i <= totalTutorialSteps; i++) {
                document.getElementById(`tutorial-step-${i}`).classList.remove('active');
            }
            document.getElementById(`tutorial-step-${currentTutorialStep}`).classList.add('active');
            
            document.getElementById('tutorial-progress-bar').style.width = `${(currentTutorialStep / totalTutorialSteps) * 100}%`;
            
            const prevButton = document.getElementById('tutorial-prev');
            const nextButton = document.getElementById('tutorial-next');
            const skipButton = document.getElementById('tutorial-skip');
            
            prevButton.classList.toggle('hidden', currentTutorialStep === 1);
            skipButton.classList.toggle('hidden', currentTutorialStep === totalTutorialSteps);
            nextButton.textContent = currentTutorialStep === totalTutorialSteps ? 'Finish' : 'Next';
            
            highlightTutorialElement(currentTutorialStep);
        }
        
        function highlightTutorialElement(step) {
            const highlightBox = document.getElementById('tutorial-highlight-box');
            const tutorialCard = document.querySelector('#tutorial-overlay .tutorial-card');

            tutorialCard.classList.remove('visible');
        
            let elementToHighlightId = null;
            
            switch(step) {
                case 2: elementToHighlightId = 'tutorial-realtime-card'; break;
                case 3: elementToHighlightId = 'tutorial-controls-card'; break;
                case 4: elementToHighlightId = 'tutorial-activity-card'; break;
                case 5: elementToHighlightId = 'tutorial-berth-grid'; break;
            }
            
            const elementToHighlight = elementToHighlightId ? document.getElementById(elementToHighlightId) : null;
        
            if (elementToHighlight) {
                elementToHighlight.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                
                setTimeout(() => {
                    const rect = elementToHighlight.getBoundingClientRect();
                    
                    highlightBox.style.width = `${rect.width + 12}px`;
                    highlightBox.style.height = `${rect.height + 12}px`;
                    highlightBox.style.top = `${rect.top - 6}px`;
                    highlightBox.style.left = `${rect.left - 6}px`;
                    highlightBox.classList.add('visible');

                    const cardRect = tutorialCard.getBoundingClientRect();
                    let cardTop, cardLeft;
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const spaceAbove = rect.top;

                    if (spaceBelow > tutorialCard.offsetHeight + 20) {
                        cardTop = rect.bottom + 15;
                    } else if (spaceAbove > tutorialCard.offsetHeight + 20) {
                        cardTop = rect.top - tutorialCard.offsetHeight - 15;
                    } else {
                        cardTop = (window.innerHeight - tutorialCard.offsetHeight) / 2;
                    }
                    
                    cardLeft = (window.innerWidth - tutorialCard.offsetWidth) / 2;
                    cardLeft = Math.max(10, Math.min(cardLeft, window.innerWidth - tutorialCard.offsetWidth - 10));

                    tutorialCard.style.top = `${cardTop}px`;
                    tutorialCard.style.left = `${cardLeft}px`;
                    tutorialCard.style.transform = '';
                    tutorialCard.classList.add('visible');
                }, 350);
        
            } else {
                highlightBox.classList.remove('visible');
                setTimeout(() => {
                    tutorialCard.style.top = '50%';
                    tutorialCard.style.left = '50%';
                    tutorialCard.style.transform = 'translate(-50%, -50%)';
                    tutorialCard.classList.add('visible');
                }, 150);
            }
        }
        
        document.getElementById('tutorial-next').addEventListener('click', () => {
            if (currentTutorialStep < totalTutorialSteps) {
                currentTutorialStep++;
                updateTutorialStep();
            } else {
                closeTutorial();
            }
        });
        
        document.getElementById('tutorial-prev').addEventListener('click', () => {
            if (currentTutorialStep > 1) {
                currentTutorialStep--;
                updateTutorialStep();
            }
        });
        
        document.getElementById('tutorial-skip').addEventListener('click', closeTutorial);
        
        document.getElementById('show-tutorial-btn').addEventListener('click', startTutorial);

        //  THEME TOGGLE SCRIPT 
        const themeToggle = document.getElementById('theme-toggle');
        const themeIconLight = document.getElementById('theme-icon-light');
        const themeIconDark = document.getElementById('theme-icon-dark');

        if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light');
            themeIconLight.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.add('theme-light');
            document.body.classList.remove('theme-dark');
            themeIconDark.classList.remove('hidden');
        }

        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            if (isDark) {
                document.body.classList.add('theme-dark');
                document.body.classList.remove('theme-light');
            } else {
                document.body.classList.add('theme-light');
                document.body.classList.remove('theme-dark');
            }
            
            themeIconLight.classList.toggle('hidden', !isDark);
            themeIconDark.classList.toggle('hidden', isDark);
        });
        
        //  SIMULATION DATA 
        const berthSpecifications = { 
            'EQ-1': { loa: 240, draft: 14.5 }, 'EQ-3': { loa: 240, draft: 14.5 }, 'EQ-4': { loa: 240, draft: 14.5 }, 
            'EQ-5': { loa: 240, draft: 11.5 }, 'EQ-6': { loa: 240, draft: 11.5 }, 'EQ-7': { loa: 240, draft: 14.5 }, 
            'EQ-8': { loa: 235, draft: 14.5 }, 'EQ-9': { loa: 235, draft: 14.5 }, 'EQ-10': { loa: 160, draft: 11 }, 
            'WQ-1': { loa: 240, draft: 11 }, 'WQ-2': { loa: 240, draft: 13.5 }, 'WQ-3': { loa: 240, draft: 13.5 }, 
            'WQ-4': { loa: 240, draft: 11.5 }, 'WQ-5': { loa: 240, draft: 11.5 }, 'WQ-6': { loa: 230, draft: 14.5 }, 
            'WQ-7': { loa: 240, draft: 14.5 }, 'WQ-8': { loa: 240, draft: 14.5 }, 'FB': { loa: 200, draft: 10.06 }, 
            'OR-1': { loa: 195, draft: 11 }, 'OR-2': { loa: 195, draft: 11 }, 'OR-3': { loa: 160, draft: 10.5 }, 
            'OSTT': { loa: 280, draft: 17 }, 'LPG': { loa: 230, draft: 14 }, 'OB-1': { loa: 300, draft: 16.5 }, 
            'OB-2': { loa: 300, draft: 17 }, 'C.TERMIN': { loa: 300, draft: 8.5 }, 'VGCB': { loa: 300, draft: 18.1 }, 
            'CB-1': { loa: 390, draft: 16 }, 'CB-2': { loa: 390, draft: 16 }, 'CB-3': { loa: 390, draft: 16 }, 
            'CB-4': { loa: 390, draft: 16 }, 'EQ-1A': { loa: 240, draft: 14.5 }, 'WQ-1RE': { loa: 240, draft: 11 }, 
            'SPM': { loa: 400, draft: 22 } 
        };
        
        const portDataByDay = { 
            27: { 
                occupancy: [
                    { berthName: 'OB-2', vesselName: 'm.v COMMON HORIZON' }, { berthName: 'C.TERMIN', vesselName: 'm.v SAFINAH' }, 
                    { berthName: 'VGCB', vesselName: 'm.v THEODORE JR' }, { berthName: 'OSTT', vesselName: 'm.t SWARNA KRISHNA' }, 
                    { berthName: 'CB-3', vesselName: 'm.v PAC SCHEDAR' }, { berthName: 'EQ-1', vesselName: 'm.v SARAH OLDENDORFF' }, 
                    { berthName: 'EQ-3', vesselName: 'm.v HERMES' }, { berthName: 'EQ-4', vesselName: 'm.v PIONEER KIRA' }, 
                    { berthName: 'EQ-6', vesselName: 'm.v KIRAN AMERICA' }, { berthName: 'EQ-9', vesselName: 'm.v NEW GALAXY' }, 
                    { berthName: 'WQ-1', vesselName: 'm.v FLAG EVI' }, { berthName: 'WQ-2', vesselName: 'm.v ENDEAVOR' }, 
                    { berthName: 'WQ-3', vesselName: 'm.v SUNNY FORTUNE' }, { berthName: 'WQ-4', vesselName: 'm.v JIN HAI ZHENG' }, 
                    { berthName: 'WQ-5', vesselName: 'm.v YIN NENG' }, { berthName: 'WQ-6', vesselName: 'm.v JABAL SAMHAN' }, 
                    { berthName: 'WQ-7', vesselName: 'm.v ILIA' }, { berthName: 'WQ-8', vesselName: 'm.v STAR HAMBURG' }, 
                    { berthName: 'OR-1', vesselName: 'm.t ZHONG CHI' }, { berthName: 'FB', vesselName: 'm.v AMOY PROGRESS' }
                ], 
                waiting: [
                    { name: 'm.v JAL KAMADHENU', tonnes: 75000, arrivalStr: '27-Sep-2025 08:00' }, 
                    { name: 'm.t ASPHALT EXPRSS', tonnes: 6000, arrivalStr: '27-Sep-2025 05:22' }, 
                    { name: 'm.v MONA LISA', tonnes: 32000, arrivalStr: '27-Sep-2025 02:50' }, 
                    { name: 'm.v CHIPOL CHANGAN', tonnes: 13000, arrivalStr: '27-Sep-2025 15:00' }, 
                    { name: 'm.t DESH VISHAL', tonnes: 261261, arrivalStr: '27-Sep-2025 15:00' }, 
                    { name: 'm.t A R G', tonnes: 9000, arrivalStr: '27-Sep-2025 18:00' }
                ] 
            }, 
            28: { 
                occupancy: [
                    { berthName: 'OB-1', vesselName: 'm.v JAL KAMADHENU' }, { berthName: 'OB-2', vesselName: 'm.v COMMON HORIZON' }, 
                    { berthName: 'C.TERMIN', vesselName: 'm.v SAFINAH' }, { berthName: 'VGCB', vesselName: 'm.v RED ORCHID' }, 
                    { berthName: 'OSTT', vesselName: 'm.t SWARNA KRISHNA' }, { berthName: 'EQ-1', vesselName: 'm.v SARAH OLDENDORFF' }, 
                    { berthName: 'EQ-3', vesselName: 'm.v HERMES' }, { berthName: 'EQ-4', vesselName: 'm.v PIONEER KIRA' }, 
                    { berthName: 'EQ-6', vesselName: 'm.v KIRAN AMERICA' }, { berthName: 'WQ-1', vesselName: 'm.v FLAG EVI' }, 
                    { berthName: 'WQ-2', vesselName: 'm.v ENDEAVOR' }, { berthName: 'WQ-3', vesselName: 'm.v SUNNY FORTUNE' }, 
                    { berthName: 'WQ-4', vesselName: 'm.v JIN HAI ZHENG' }, { berthName: 'WQ-5', vesselName: 'm.v YIN NENG' }, 
                    { berthName: 'WQ-6', vesselName: 'm.v JABAL SAMHAN' }, { berthName: 'WQ-7', vesselName: 'm.v ILIA' }, 
                    { berthName: 'WQ-8', vesselName: 'm.v STAR HAMBURG' }, { berthName: 'OR-1', vesselName: 'm.t ZHONG CHI' }, 
                    { berthName: 'OR-3', vesselName: 'm.t ASPHALT EXPRESS' }, { berthName: 'FB', vesselName: 'm.v AMOY PROGRESS' }
                ], 
                waiting: [
                    { name: 'm.t ALPINE LIGHT', tonnes: 34650, arrivalStr: '28-Sep-2025 01:45' }, 
                    { name: 'm.v PAC CAPELLA', tonnes: 8240, arrivalStr: '28-Sep-2025 05:56' }, 
                    { name: 'm.t AL SHAFFIAH', tonnes: 11923, arrivalStr: '28-Sep-2025 10:00' }, 
                    { name: 'm.v WAN HAI 367', tonnes: 21500, arrivalStr: '28-Sep-2025 09:00' }, 
                    { name: 'm.v GSL MELINA', tonnes: 24000, arrivalStr: '28-Sep-2025 15:00' }
                ] 
            }, 
            29: { 
                occupancy: [
                    { berthName: 'OB-1', vesselName: 'm.v JAL KAMADHENU' }, { berthName: 'C.TERMIN', vesselName: 'm.v SAFINAH' }, 
                    { berthName: 'VGCB', vesselName: 'm.v RED ORCHID' }, { berthName: 'LPG', vesselName: 'LPG/C. GAS VIRGO' }, 
                    { berthName: 'CB-2', vesselName: 'm.v WAN HAI 367' }, { berthName: 'CB-3', vesselName: 'm.v GSL MELINA' }, 
                    { berthName: 'EQ-1', vesselName: 'm.v SARAH OLDENDORFF' }, { berthName: 'EQ-3', vesselName: 'm.v HERMES' }, 
                    { berthName: 'EQ-4', vesselName: 'm.v PIONEER KIRA' }, { berthName: 'EQ-6', vesselName: 'm.v KIRAN AMERICA' }, 
                    { berthName: 'WQ-1', vesselName: 'm.v FLAG EVI' }, { berthName: 'WQ-2', vesselName: 'm.v ENDEAVOR' }, 
                    { berthName: 'WQ-3', vesselName: 'm.v NORD UTOPIA' }, { berthName: 'WQ-4', vesselName: 'm.v CHIPOL CHANGAN' }, 
                    { berthName: 'WQ-5', vesselName: 'm.v INLACO EXPRESS' }, { berthName: 'WQ-6', vesselName: 'm.v JABAL SAMHAN' }, 
                    { berthName: 'WQ-7', vesselName: 'm.v ILIA' }, { berthName: 'WQ-8', vesselName: 'm.v STAR HAMBURG' }, 
                    { berthName: 'OR-1', vesselName: 'm.t ALPINE LIGHT' }, { berthName: 'OR-3', vesselName: 'm.t A R G' }
                ], 
                waiting: [
                    { name: 'm.v GCL GANGA', tonnes: 105000, arrivalStr: '29-Sep-2025 15:00' }, 
                    { name: 'm.t GLBS MAGIC', tonnes: 54390, arrivalStr: '29-Sep-2025 00:13' }, 
                    { name: 'm.v SANTA IRINI [GLP]', tonnes: 32872, arrivalStr: '29-Sep-2025 18:00' }, 
                    { name: 'm.v HAPPY HERO', tonnes: 8233, arrivalStr: '29-Sep-2025 12:00' }, 
                    { name: 'm.v CONTSHIP ANA II', tonnes: 18000, arrivalStr: '29-Sep-2025 10:00' }, 
                    { name: 'm.t STI DUCHESSA', tonnes: 6797, arrivalStr: '29-Sep-2025 19:00' }, 
                    { name: 'LPG/C SEARAMBLER', tonnes: 5000, arrivalStr: '29-Sep-2025 11:30' }
                ] 
            }, 
            30: { 
                occupancy: [
                    { berthName: 'OB-1', vesselName: 'm.v JAL KAMADHENU' }, { berthName: 'C.TERMIN', vesselName: 'm.v SAFINAH' }, 
                    { berthName: 'VGCB', vesselName: 'm.v RED ORCHID' }, { berthName: 'SPM', vesselName: 'm.t DESH VISHAL' }, 
                    { berthName: 'LPG', vesselName: 'LPG/C. GAS VIRGO' }, { berthName: 'CB-2', vesselName: 'm.v CONTSHIP ANA II' }, 
                    { berthName: 'EQ-1', vesselName: 'm.v SARAH OLDENDORFF' }, { berthName: 'EQ-3', vesselName: 'm.y BOS BROOK' }, 
                    { berthName: 'EQ-4', vesselName: 'm.v PIONEER KIRA' }, { berthName: 'EQ-6', vesselName: 'm.v KIRAN AMERICA' }, 
                    { berthName: 'WQ-1RE', vesselName: 'm.v HAPPY HERO' }, { berthName: 'WQ-1', vesselName: 'm.v RIO RITA' }, 
                    { berthName: 'WQ-2', vesselName: 'm.v PAC CAPELLA' }, { berthName: 'WQ-3', vesselName: 'm.v NORD UTOPIA' }, 
                    { berthName: 'WQ-4', vesselName: 'm.v CHIPOL CHANGAN' }, { berthName: 'WQ-5', vesselName: 'm.v INLACO EXPRESS' }, 
                    { berthName: 'WQ-6', vesselName: 'm.v JABAL SAMHAN' }, { berthName: 'WQ-7', vesselName: 'm.v ILIA' }, 
                    { berthName: 'WQ-8', vesselName: 'm.v STAR HAMBURG' }, { berthName: 'OR-1', vesselName: 'm.t ALPINE LIGHT' }, 
                    { berthName: 'FB', vesselName: 'LPG/C SEARAMBLER' }
                ], 
                waiting: [
                    { name: 'm.v GCL GANGA', tonnes: 105000, arrivalStr: '29-Sep-2025 12:08' }, 
                    { name: 'm.v ABRAM SCHULTE', tonnes: 55000, arrivalStr: '30-Sep-2025 12:00' }, 
                    { name: 'm.v MONA LISA', tonnes: 32000, arrivalStr: '27-Sep-2025 02:50' }, 
                    { name: 'm.t GLBS MAGIC', tonnes: 54390, arrivalStr: '29-Sep-2025 00:13' }, 
                    { name: 'm.v SANTA IRINI [GLP]', tonnes: 32872, arrivalStr: '30-Sep-2025 13:00' }, 
                    { name: 'm.t AL SHAFFIAH', tonnes: 11923, arrivalStr: '28-Sep-2025 17:41' }, 
                    { name: 'm.v CL ANZI HE', tonnes: 55900, arrivalStr: '30-Sep-2025 10:00' }, 
                    { name: 'LPG/C GREEN SANVI', tonnes: 25900, arrivalStr: '26-Sep-2025 06:28' }, 
                    { name: 'm.t STI DUCHESSA', tonnes: 6797, arrivalStr: '29-Sep-2025 07:52' }
                ] 
            }, 
            1: { 
                occupancy: [
                    { berthName: 'C.TERMIN', vesselName: 'm.v SAFINAH' }, { berthName: 'VGCB', vesselName: 'm.v MONA LISA' }, 
                    { berthName: 'SPM', vesselName: 'm.t DESH VISHAL' }, { berthName: 'CB-1', vesselName: 'm.v SSL SABARIMALAI' }, 
                    { berthName: 'EQ-1A', vesselName: 'm.v SANTA IRINI' }, { berthName: 'EQ-1', vesselName: 'm.v GLBS MAGIC' }, 
                    { berthName: 'EQ-3', vesselName: 'm.v BOS BROOK' }, { berthName: 'EQ-4', vesselName: 'm.v RACOON' }, 
                    { berthName: 'EQ-6', vesselName: 'm.v KIRAN AMERICA' }, { berthName: 'WQ-1RE', vesselName: 'm.v HAPPY HERO' }, 
                    { berthName: 'WQ-1', vesselName: 'm.v RIO RITA' }, { berthName: 'WQ-2', vesselName: 'm.v PAC CAPELLA' }, 
                    { berthName: 'WQ-3', vesselName: 'm.v NORD UTOPIA' }, { berthName: 'WQ-4', vesselName: 'm.v CHIPOL CHANGAN' }, 
                    { berthName: 'WQ-6', vesselName: 'm.v JABAL SAMHAN' }, { berthName: 'WQ-7', vesselName: 'm.v ILIA' }, 
                    { berthName: 'WQ-8', vesselName: 'm.v STAR HAMBURG' }, { berthName: 'OR-3', vesselName: 'm.t AL SHAFFIAH' }
                ], 
                waiting: [
                    { name: 'm.v GCL GANGA', tonnes: 105000, arrivalStr: '29-Sep-2025 12:08' }, 
                    { name: 'm.v ABRAM SCHULTE', tonnes: 55000, arrivalStr: '30-Sep-2025 10:21' }, 
                    { name: 'm.v STARLIGHT', tonnes: 34037, arrivalStr: '02-Sep-2025 16:28' }, 
                    { name: 'm.t HELEN M', tonnes: 34650, arrivalStr: '30-Sep-2025 18:57' }, 
                    { name: 'm.t LOURDES', tonnes: 6000, arrivalStr: '01-Oct-2025 03:22' }, 
                    { name: 'LPG/C GAS QUANTUM', tonnes: 5000, arrivalStr: '01-Oct-2025 13:00' }, 
                    { name: 'm.v PORTO LIMNIONI [GLP]', tonnes: 44000, arrivalStr: '01-Oct-2025 10:00' }, 
                    { name: 'm.v GEOPRIDE', tonnes: 46176, arrivalStr: '01-Oct-2025 15:00' }, 
                    { name: 'm.y CL ANZI HE', tonnes: 55900, arrivalStr: '01-Oct-2025 10:00' }, 
                    { name: 'm.v VAN INFINITY', tonnes: 19000, arrivalStr: '01-Oct-2025 21:30' }, 
                    { name: 'm..v XIN TIAN JIN', tonnes: 35100, arrivalStr: '01-Oct-2025 09:30' }, 
                    { name: 'LPG/C GREEN SANVI', tonnes: 25900, arrivalStr: '26-Sep-2025 06:28' }, 
                    { name: 'm.t STI DUCHESSA', tonnes: 6797, arrivalStr: '29-Sep-2025 07:52' }, 
                    { name: 'LPG/C SHIVALIK', tonnes: 30000, arrivalStr: '02-Sep-2025 04:00' }
                ] 
            }, 
            2: { 
                occupancy: [
                    { berthName: 'OB-2', vesselName: 'm.v GCL GANGA' }, { berthName: 'VGCB', vesselName: 'm.v CL ANZI HE' }, 
                    { berthName: 'CB-3', vesselName: 'm.v XIN TIAN JIN' }, { berthName: 'EQ-1A', vesselName: 'm.v SANTA IRINI' }, 
                    { berthName: 'EQ-1', vesselName: 'm.v GLBS MAGIC' }, { berthName: 'EQ-3', vesselName: 'm.v BOS BROOK' }, 
                    { berthName: 'EQ-4', vesselName: 'm.v RACOON' }, { berthName: 'EQ-8', vesselName: 'm.v GEOPRIDE' }, 
                    { berthName: 'WQ-1RE', vesselName: 'm.v HAPPY HERO' }, { berthName: 'WQ-1', vesselName: 'm.v RIO RITA' }, 
                    { berthName: 'WQ-2', vesselName: 'm.v PAC CAPELLA' }, { berthName: 'WQ-3', vesselName: 'm.v NORD UTOPIA' }, 
                    { berthName: 'WQ-6', vesselName: 'm.v JABAL SAMHAN' }, { berthName: 'WQ-7', vesselName: 'm.v ILIA' }, 
                    { berthName: 'OR-1', vesselName: 'm.t STI DUCHESSA' }
                ], 
                waiting: [
                    { name: 'm.v ABRAM SCHULTE', tonnes: 55000, arrivalStr: '30-Sep-2025 10:21' }, 
                    { name: 'm.v AN HAI STAR', tonnes: 4230, arrivalStr: '02-Oct-2025 10:00' }, 
                    { name: 'm.v ISE', tonnes: 18000, arrivalStr: '02-Oct-2025 13:00' }, 
                    { name: 'm.v STARLIGHT', tonnes: 34037, arrivalStr: '02-Sep-2025 16:28' }, 
                    { name: 'm.v SAFINAH', tonnes: 29040, arrivalStr: '05-Aug-2025 17:48' }, 
                    { name: 'm.t HELEN M', tonnes: 34650, arrivalStr: '30-Sep-2025 18:57' }, 
                    { name: 'LPG/C GAS QUANTUM', tonnes: 5000, arrivalStr: '02-Oct-2025 08:00' }, 
                    { name: 'm.v PORTO LIMNIONI [GLP]', tonnes: 44000, arrivalStr: '01-Oct-2025 09:03' }, 
                    { name: 'm.y RAON TERESA', tonnes: 8258, arrivalStr: '02-Oct-2025 05:23' }, 
                    { name: 'm.v VAN INFINITY', tonnes: 19000, arrivalStr: '02-Oct-2025 08:00' }, 
                    { name: 'm.v SSL THAMIRABARANI', tonnes: 8500, arrivalStr: '04-Sep-2025 04:00' }, 
                    { name: 'LPG/C GREEN SANVI', tonnes: 25900, arrivalStr: '26-Sep-2025 06:28' }, 
                    { name: 'LPG/C. SHIVALIK', tonnes: 30000, arrivalStr: '02-Sep-2025 04:30' }
                ] 
            } 
        };
        
        const allBerthNames = [...new Set(Object.keys(berthSpecifications))];

        //  SIMULATION LOGIC 
        let berths = [];
        let vessels = [];
        let simulationTime;
        let currentDay = 29;
        let berthHistory = {};
        let activityLog = [];
        let simulationInterval = null;
        let totalWaitTimeForDay = 0;
        let totalTimeOptimizedForDay = 0;
        let dailyStats = {
            totalWaitTime: 0,
            totalTimeOptimized: 0,
            vesselsBerthed: 0,
            vesselsWaiting: 0
        };

        let ongoingVesselServices = {};

        
        const REAL_TIME_UPDATE_INTERVAL = 300000; 
        const WEATHER_UPDATE_INTERVAL = 1800000; 
        
        const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY'; 
        const VESSELFINDER_API_KEY = 'YOUR_VESSELFINDER_API_KEY'; 
        
        let realTimeData = {
            vesselsInPort: [],
            expectedArrivals: [],
            recentDepartures: [],
            weatherData: null,
            lastUpdate: null
        };

        function initRealTimeIntegration() {
            loadRealTimeData();
            setInterval(loadRealTimeData, REAL_TIME_UPDATE_INTERVAL);
            setInterval(loadWeatherData, WEATHER_UPDATE_INTERVAL);
            document.getElementById('refreshRealTimeData').addEventListener('click', loadRealTimeData);
        }

        async function loadRealTimeData() {
            try {
                updateLastUpdatedTime();
                await loadWeatherData();
                await loadVesselData();
                renderRealTimeData();
            } catch (error) {
                console.error('Error loading real-time data:', error);
                showDataError('Failed to load real-time data');
            }
        }

        async function loadWeatherData() {
            try {
                // Using OpenWeatherMap API 
                const API_KEY = 'OPENWEATHER_API_KEY';
                const lat = 17.6871; // Visakhapatnam coordinates
                const lon = 83.3007;
                
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                );
                
                if (!response.ok) {
                    throw new Error('Weather data unavailable');
                }
                
                const data = await response.json();
                
                realTimeData.weatherData = {
                    temperature: Math.round(data.main.temp),
                    humidity: data.main.humidity,
                    description: data.weather[0].description,
                    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                    pressure: data.main.pressure,
                    icon: data.weather[0].icon
                };
                
                renderWeatherData();
            } catch (error) {
                console.error('Error loading weather data:', error);
                // Fallback to demo data if API fails
                realTimeData.weatherData = {
                    temperature: 28,
                    humidity: 75,
                    description: 'Partly cloudy',
                    windSpeed: 12,
                    pressure: 1013,
                    icon: '02d'
                };
                renderWeatherData();
            }
        }

       async function loadVesselData() {
            try {

                
                const now = new Date();
                const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                // Simulate real-time vessel movements with current timestamps
                realTimeData.vesselsInPort = [
                    { 
                        name: 'MV Ocean Carrier', 
                        status: 'In Port', 
                        size: '228×32m', 
                        time: currentTime, 
                        type: 'Container',
                        arrival: '15:33'
                    },
                    { 
                        name: 'SSL Sabarimalai', 
                        status: 'In Port', 
                        size: '225×37m', 
                        time: currentTime, 
                        type: 'Bulk Carrier',
                        arrival: '15:42'
                    },
                    { 
                        name: 'MV Santa Irini', 
                        status: 'In Port', 
                        size: '225×36m', 
                        time: currentTime, 
                        type: 'General Cargo',
                        arrival: '15:37'
                    }
                ];
                
                const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
                const nextTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                
                realTimeData.expectedArrivals = [
                    { 
                        name: 'MV Pacific Star', 
                        eta: nextHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                        size: '175×28m', 
                        type: 'Container' 
                    },
                    { 
                        name: 'MV Northern Light', 
                        eta: nextTwoHours.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                        size: '228×32m', 
                        type: 'Bulk Carrier' 
                    }
                ];
                
                // Recent departures within the last 2 hours
                const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
                const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
                
                realTimeData.recentDepartures = [
                    { 
                        name: 'MV Sunny Fortune', 
                        time: oneHourAgo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                        size: '199×32m', 
                        type: 'Container' 
                    },
                    { 
                        name: 'MV Endeavor', 
                        time: twoHoursAgo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                        size: '280×40m', 
                        type: 'Tanker' 
                    }
                ];
                
            } catch (error) {
                console.error('Error loading vessel data:', error);
                // Fallback to basic demo data
                realTimeData.vesselsInPort = [];
                realTimeData.expectedArrivals = [];
                realTimeData.recentDepartures = [];
            }
        }

        function renderRealTimeData() {
            document.getElementById('vessels-in-port').textContent = realTimeData.vesselsInPort.length;
            document.getElementById('expected-arrivals').textContent = realTimeData.expectedArrivals.length;
            document.getElementById('recent-departures').textContent = realTimeData.recentDepartures.length;
            
            const vesselsBody = document.getElementById('real-time-vessels-body');
            vesselsBody.innerHTML = '';
            
            realTimeData.vesselsInPort.forEach(vessel => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50';
                row.innerHTML = `
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="font-medium text-slate-800 dark:text-slate-100">${vessel.name}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">${vessel.type}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full">
                            ${vessel.status}
                        </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        ${vessel.size}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        ${vessel.time}
                    </td>
                `;
                vesselsBody.appendChild(row);
            });
        }

        function renderWeatherData() {
            const weatherContent = document.getElementById('weather-content');
            if (!realTimeData.weatherData) {
                weatherContent.innerHTML = `
                    <div class="text-center py-4">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Loading weather data...</p>
                    </div>`;
                return;
            }
            
            const weather = realTimeData.weatherData;
            const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
            
            weatherContent.innerHTML = `
                <div class="text-center mb-4">
                    <img src="${iconUrl}" alt="${weather.description}" class="w-16 h-16 mx-auto mb-2">
                    <div class="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">${weather.temperature}°C</div>
                    <div class="text-sm text-slate-600 dark:text-slate-300 capitalize">${weather.description}</div>
                </div>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div class="text-slate-500 dark:text-slate-400 mb-1">Humidity</div>
                        <div class="font-semibold text-slate-800 dark:text-slate-100">${weather.humidity}%</div>
                    </div>
                    <div class="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div class="text-slate-500 dark:text-slate-400 mb-1">Wind</div>
                        <div class="font-semibold text-slate-800 dark:text-slate-100">${weather.windSpeed} km/h</div>
                    </div>
                    <div class="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div class="text-slate-500 dark:text-slate-400 mb-1">Pressure</div>
                        <div class="font-semibold text-slate-800 dark:text-slate-100">${weather.pressure} hPa</div>
                    </div>
                    <div class="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div class="text-slate-500 dark:text-slate-400 mb-1">Updated</div>
                        <div class="font-semibold text-slate-800 dark:text-slate-100">Just now</div>
                    </div>
                </div>
            `;
        }

        function updateLastUpdatedTime() {
            const now = new Date();
            realTimeData.lastUpdate = now;
            document.getElementById('last-updated-time').textContent = 
                now.toLocaleTimeString();
        }

        function showDataError(message) {
            const vesselsBody = document.getElementById('real-time-vessels-body');
            vesselsBody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-4 py-8 text-center text-red-500 dark:text-red-400">
                        ${message}
                    </td>
                </tr>
            `;
        }

        function init() {
            setupDay(currentDay);
            
            ['27', '28', '29', '30', '1', '2'].forEach(day => {
                document.getElementById(`day${day}Btn`).addEventListener('click', () => setupDay(parseInt(day)));
            });

            document.getElementById('resetDataBtn').addEventListener('click', () => setupDay(currentDay));
            document.getElementById('runOptimizationBtn').addEventListener('click', startDailySimulation);
            document.getElementById('stopSimulationBtn').addEventListener('click', stopSimulation);

            document.getElementById('modal-close-btn').addEventListener('click', closeBerthHistoryModal);
            document.getElementById('modal-backdrop').addEventListener('click', closeBerthHistoryModal);
            
            initRealTimeIntegration();
            
            checkFirstVisit();
        }
        
        function setupDay(day) {
            stopSimulation();
            
            currentDay = day;
            
            let month, year;
            if (day >= 1 && day <= 2) {
                month = 9; 
                year = 2025;
            } else {
                month = 8;
                year = 2025;
            }
            
            simulationTime = new Date(year, month, day, 6, 0, 0);
            
            // Reset counters
            totalWaitTimeForDay = 0;
            totalTimeOptimizedForDay = 0;
            dailyStats = {
                totalWaitTime: 0,
                totalTimeOptimized: 0,
                vesselsBerthed: 0,
                vesselsWaiting: 0
            };
            
            if (!ongoingVesselServices) {
                ongoingVesselServices = {};
            }
            
            logActivity(`Simulation initialized for ${simulationTime.toLocaleDateString()}`, 'start');
            
            document.querySelectorAll('.date-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`day${day}Btn`).classList.add('active');

            setupInitialState();
            renderDashboard();
        }

        function setupInitialState() {
            vessels = [];
            berths = [];
            
            const dayData = portDataByDay[currentDay];
            
            allBerthNames.forEach((name, index) => {
                const spec = berthSpecifications[name] || { loa: 200, draft: 12 };
                berths.push({ 
                    id: index + 1, 
                    name: name, 
                    loa: spec.loa, 
                    draft: spec.draft, 
                    isOccupied: false, 
                    occupiedBy: null, 
                    freeAfter: null,
                    currentVessel: null 
                });
                if (!berthHistory[name]) berthHistory[name] = [];
            });

            dayData.occupancy.forEach((occupiedBerthData, index) => {
                const berth = berths.find(b => b.name === occupiedBerthData.berthName);
                if (berth && !berth.isOccupied) { 
                    berth.isOccupied = true;
                    const vesselName = occupiedBerthData.vesselName;
                    
                    let departureTime;
                    if (ongoingVesselServices[vesselName]) {
                        departureTime = ongoingVesselServices[vesselName];
                    } else {
                        const serviceHours = 8 + Math.random() * 24;
                        departureTime = new Date(simulationTime.getTime() + serviceHours * 60 * 60 * 1000);
                        ongoingVesselServices[vesselName] = departureTime;
                    }
                    
                    const vessel = createVessel(vesselName, 50000);
                    vessel.id = `V-preberthed-${currentDay}-${index}`;
                    vessel.status = 'Berthed';
                    vessel.assignedBerthId = berth.id;
                    vessel.arrivalTime = new Date(simulationTime.getTime() - 8 * 60 * 60 * 1000);
                    vessel.berthingTime = new Date(simulationTime.getTime() - 7 * 60 * 60 * 1000);
                    vessel.departureTime = departureTime;

                    vessels.push(vessel);
                    berth.occupiedBy = vessel.id;
                    berth.freeAfter = departureTime;
                    berth.currentVessel = vessel; 

                    const isAlreadyInHistory = berthHistory[berth.name].some(rec => 
                        rec.vesselName === vessel.name && rec.status === 'Berthed' && 
                        rec.berthingTime.getTime() === vessel.berthingTime.getTime()
                    );
                    if (!isAlreadyInHistory) {
                        berthHistory[berth.name].push({ 
                            vesselName: vessel.name, 
                            berthingTime: vessel.berthingTime, 
                            departureTime: vessel.departureTime, 
                            status: 'Berthed' 
                        });
                    }
                }
            });

            const waitingVesselsData = JSON.parse(JSON.stringify(dayData.waiting));
            waitingVesselsData.forEach((v, i) => {
                const newVessel = createVessel(v.name, v.tonnes);
                newVessel.id = `V-waiting-${currentDay}-${i}`;
                
                const arrivalStr = v.arrivalStr;
                let arrivalDate;
                
                // Handle different date formats in the data
                if (arrivalStr.includes('Sep') || arrivalStr.includes('Oct')) {
                    // Parse format like "27-Sep-2025 08:00" or "01-Oct-2025 03:22"
                    const [datePart, timePart] = arrivalStr.split(' ');
                    const [day, month, year] = datePart.split('-');
                    
                    // Convert month name to number (0-indexed)
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const monthNum = monthNames.indexOf(month);
                    
                    if (timePart) {
                        const [hours, minutes] = timePart.split(':');
                        arrivalDate = new Date(year, monthNum, parseInt(day), 
                                            parseInt(hours), parseInt(minutes));
                    } else {
                        arrivalDate = new Date(year, monthNum, parseInt(day));
                    }
                } else {
                    // Fallback for other formats - use simulation time as base
                    arrivalDate = new Date(simulationTime);
                    // Add some random offset to spread out arrivals
                    arrivalDate.setHours(arrivalDate.getHours() - 2 + (i * 2));
                }
                
                // Ensure the arrival date is valid and not in the distant past/future
                if (isNaN(arrivalDate.getTime()) || arrivalDate.getFullYear() > 2030) {
                    // Use simulation time as fallback with some variation
                    arrivalDate = new Date(simulationTime);
                    arrivalDate.setHours(arrivalDate.getHours() - 2 + (i * 2));
                }
                
                newVessel.arrivalTime = arrivalDate;
                vessels.push(newVessel);
            });
        }
        
        function createVessel(name, tonnes) {
            let size, loa, draft;
            if (tonnes < 20000) { 
                size = 'Small'; 
                loa = 100 + Math.random() * 60; 
                draft = 8 + Math.random() * 2; 
            } else if (tonnes < 80000) { 
                size = 'Medium'; 
                loa = 161 + Math.random() * 70; 
                draft = 10.1 + Math.random() * 3; 
            } else { 
                size = 'Large'; 
                loa = 231 + Math.random() * 70; 
                draft = 13.2 + Math.random() * 3; 
            }
            return { 
                name: name, 
                size: size, 
                loa: parseFloat(loa.toFixed(2)), 
                draft: parseFloat(draft.toFixed(2)), 
                berthingTime: null, 
                departureTime: null, 
                status: 'Waiting', 
                assignedBerthId: null 
            };
        }

        function startDailySimulation() {
            document.getElementById('runOptimizationBtn').classList.add('hidden');
            document.getElementById('stopSimulationBtn').classList.remove('hidden');
            
            logActivity(`Daily simulation started. Running for 24 hours...`, 'start');
            
            let hoursSimulated = 0;
            const totalHours = 24;
            
            simulationInterval = setInterval(() => {
                if (hoursSimulated >= totalHours) {
                    stopSimulation();
                    logActivity(`Daily simulation completed. Total wait time: ${totalWaitTimeForDay.toFixed(2)} hours, Time optimized: ${totalTimeOptimizedForDay.toFixed(2)} hours`, 'completion');
                    return;
                }
                
                simulationTime.setHours(simulationTime.getHours() + 1);
                advanceSimulationHour();
                renderDashboard();
                hoursSimulated++;
                
                if (hoursSimulated % 6 === 0) {
                    logActivity(`Simulation progress: ${hoursSimulated}/24 hours completed`, 'progress');
                }
            }, 1000);
        }
        
        function stopSimulation() {
            if (simulationInterval) {
                clearInterval(simulationInterval);
                simulationInterval = null;
            }
            
            document.getElementById('runOptimizationBtn').classList.remove('hidden');
            document.getElementById('stopSimulationBtn').classList.add('hidden');
            
            logActivity(`Simulation stopped manually`, 'stop');
        }

        function advanceSimulationHour() {
            // Part 1: Update world state by processing departures
            berths.forEach(b => {
                if (b.isOccupied && b.freeAfter && b.freeAfter <= simulationTime) {
                    const departedVessel = vessels.find(v => v.id === b.occupiedBy);
                    if (departedVessel) {
                        departedVessel.status = 'Departed';
                        logActivity(`<strong>${departedVessel.name}</strong> has departed from Berth <strong>${b.name}</strong> at ${simulationTime.toLocaleTimeString()}.`, 'departure');
                        
                        delete ongoingVesselServices[departedVessel.name];
                        
                        const historyRecord = berthHistory[b.name]?.find(rec => 
                            rec.vesselName === departedVessel.name && 
                            rec.status === 'Berthed' &&
                            rec.berthingTime.getTime() === departedVessel.berthingTime.getTime()
                        );
                        if (historyRecord) {
                            historyRecord.status = 'Departed';
                            historyRecord.departureTime = new Date(simulationTime);
                        }
                    }
                    b.isOccupied = false; 
                    b.occupiedBy = null; 
                    b.freeAfter = null;
                    b.currentVessel = null;
                }
            });

            // Part 2: Run the optimization algorithm for new assignments
            optimizeScheduleWithColumnGeneration();
        }

        /**
         * Optimizes dock scheduling using a methodology inspired by Column Generation.
         *
         * In large-scale optimization, Column Generation is a technique to solve problems
         * with a vast number of variables (columns). Instead of considering all variables
         * at once, it starts with a small subset and iteratively generates and adds new,
         * promising variables until an optimal solution is found.
         *
         * This process involves:
         * 1. A 'Master Problem': The core optimization problem with a restricted set of variables.
         * 2. A 'Subproblem' (or 'Pricing Problem'): A routine to find a new variable (column)
         * with a negative reduced cost, which can improve the Master Problem's solution.
         *
         * In this simulation, we apply this concept metaphorically:
         * - A 'Column' represents a potential assignment of a single vessel to a compatible berth.
         * - The 'Subproblem' is the process of generating all valid potential assignments (columns) and calculating their cost.
         * - The 'Master Problem' is the process of selecting the best set of non-conflicting
         * assignments from the generated candidates to minimize total waiting time.
         */
        function optimizeScheduleWithColumnGeneration() {
            const vesselsToAssign = vessels.filter(v => v.status === 'Waiting' && v.arrivalTime <= simulationTime);
            const availableBerths = berths.filter(b => !b.isOccupied);

            if (vesselsToAssign.length === 0 || availableBerths.length === 0) {
                return; // Nothing to optimize
            }

            // --- SUBPROBLEM / PRICING PROBLEM: Generate all candidate columns (assignments) ---
            // Each candidate is a potential assignment with an associated cost.
            // We aim to prioritize vessels that have been waiting the longest.
            // The "cost" here is the negative of the waiting time, so minimizing cost
            // is equivalent to maximizing waiting time (i.e., serving the most overdue vessel).
            let candidateAssignments = [];
            for (const vessel of vesselsToAssign) {
                for (const berth of availableBerths) {
                    if (isCompatible(vessel, berth)) {
                        const waitingHours = (simulationTime - vessel.arrivalTime) / (1000 * 60 * 60);
                        candidateAssignments.push({
                            vessel: vessel,
                            berth: berth,
                            cost: -waitingHours, // We want to pick the assignment with the most negative cost
                            waitingHours: waitingHours
                        });
                    }
                }
            }

            if (candidateAssignments.length === 0) {
                return; // No compatible assignments are possible
            }

            // --- MASTER PROBLEM: Select the best columns (assignments) iteratively ---
            // This is a greedy approach to solving the assignment problem. At each step,
            // we select the best possible assignment (the one with the lowest cost)
            // from the remaining candidates.
            
            // Sort candidates by cost to easily pick the best one first (longest wait time)
            candidateAssignments.sort((a, b) => a.cost - b.cost);
            
            let assignedVessels = new Set();
            let assignedBerths = new Set();
            let assignmentsMade = 0;

            for (const assignment of candidateAssignments) {
                const { vessel, berth, waitingHours } = assignment;

                // Check if vessel or berth has already been assigned in this optimization step
                if (!assignedVessels.has(vessel.id) && !assignedBerths.has(berth.id)) {
                    
                    // --- Assign the vessel to the berth ---
                    vessel.berthingTime = new Date(simulationTime);
                    const serviceDuration = (Math.floor(Math.random() * 8) + 4) * 60 * 60 * 1000;
                    vessel.departureTime = new Date(vessel.berthingTime.getTime() + serviceDuration);
                    vessel.status = 'Berthed';
                    vessel.assignedBerthId = berth.id;

                    berth.isOccupied = true;
                    berth.occupiedBy = vessel.id;
                    berth.freeAfter = vessel.departureTime;
                    berth.currentVessel = vessel;
                    
                    ongoingVesselServices[vessel.name] = vessel.departureTime;

                    // Add to the sets of assigned resources to prevent double-booking
                    assignedVessels.add(vessel.id);
                    assignedBerths.add(berth.id);
                    
                    assignmentsMade++;

                    // Update analytics
                    if (waitingHours > 0 && waitingHours < 1000) { // Safety bounds
                        totalWaitTimeForDay += waitingHours;
                        const targetWaitTimeHours = 4; // An arbitrary target for optimization calculation
                        const timeOptimized = Math.max(0, targetWaitTimeHours - waitingHours);
                        totalTimeOptimizedForDay += timeOptimized;
                    }

                    logActivity(`<strong>${vessel.name}</strong> berthed at <strong>${berth.name}</strong>. Wait time: ${waitingHours.toFixed(2)}h`, 'berthing');
                    berthHistory[berth.name].push({
                        vesselName: vessel.name,
                        berthingTime: vessel.berthingTime,
                        departureTime: vessel.departureTime,
                        status: 'Berthed'
                    });
                }
            }
            
            if (assignmentsMade > 0) {
                 logActivity(`Optimization algorithm assigned ${assignmentsMade} vessel(s) to available berths.`, 'progress');
            }
        }
        
        function isCompatible(vessel, berth) { 
            return vessel.loa <= berth.loa && vessel.draft <= berth.draft; 
        }

        function logActivity(message, type) {
            activityLog.unshift({ timestamp: new Date(simulationTime), message, type });
            if (activityLog.length > 50) activityLog.pop();
        }

        function renderDashboard() {
            renderBerthGrid();
            renderWaitingList();
            renderAnalytics();
            renderAllotmentPlan();
            renderActivityLog();
        }

        function renderBerthGrid() {
            const grid = document.getElementById('berth-grid');
            grid.innerHTML = '';
            berths.sort((a,b)=> a.id - b.id).forEach(berth => {
                const isOccupied = berth.isOccupied;
                const vessel = isOccupied ? vessels.find(v => v.id === berth.occupiedBy) : null;
                const statusPill = isOccupied 
                    ? `<div class="text-xs font-bold uppercase tracking-wider text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-800/50 px-2 py-1 rounded-full">Occupied</div>`
                    : `<div class="text-xs font-bold uppercase tracking-wider text-green-800 bg-green-200 dark:text-green-200 dark:bg-green-800/50 px-2 py-1 rounded-full">Available</div>`;
                const card = document.createElement('div');
                card.className = `glass-card-interactive p-4 rounded-xl flex flex-col justify-between min-h-[160px] bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer`;
                card.addEventListener('click', () => openBerthHistoryModal(berth));
                let content = `
                    <div class="flex justify-between items-center">
                        <div class="font-bold text-lg text-slate-800 dark:text-slate-100">${berth.name}</div>
                        ${statusPill}
                    </div>
                    <div class="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        LOA: ${berth.loa}m | Draft: ${berth.draft}m
                    </div>`;
                if (isOccupied && vessel) {
                    content += `<div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 truncate">${vessel.name}</div>
                        <div class="text-xs text-slate-600 dark:text-slate-300 mt-1">
                            Free: ${berth.freeAfter.toLocaleString([], { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>`;
                }
                card.innerHTML = content;
                grid.appendChild(card);
            });
        }
        
        function renderActivityLog() {
            const logContainer = document.getElementById('activity-log');
            logContainer.innerHTML = '';
            if (activityLog.length === 0) {
                logContainer.innerHTML = `<p class="text-sm text-slate-600 dark:text-slate-400 text-center py-4">No activity yet.</p>`;
                return;
            }
            const iconMap = {
                berthing: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clip-rule="evenodd" /></svg>`,
                departure: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clip-rule="evenodd" transform="rotate(180 10 10)"/></svg>`,
                start: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clip-rule="evenodd" /></svg>`,
                progress: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" /></svg>`,
                completion: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>`,
                stop: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" /></svg>`
            };
            activityLog.forEach(item => {
                const logItem = document.createElement('div');
                logItem.className = 'flex items-start gap-3';
                logItem.innerHTML = `
                    <div class="flex-shrink-0 pt-1">${iconMap[item.type] || ''}</div>
                    <div>
                        <p class="text-sm text-slate-800 dark:text-slate-200">${item.message}</p>
                        <p class="text-xs text-slate-600 dark:text-slate-400">${item.timestamp.toLocaleTimeString()}</p>
                    </div>`;
                logContainer.appendChild(logItem);
            });
        }

        function openBerthHistoryModal(berth) {
            const modal = document.getElementById('berth-history-modal');
            document.getElementById('modal-title').textContent = `Berth ${berth.name} - Service History`;
            const list = document.getElementById('modal-history-list');
            list.innerHTML = '';
            const history = berthHistory[berth.name] || [];

            if (history.length === 0) {
                list.innerHTML = `<li class="text-center text-slate-600 dark:text-slate-400 py-6">No service history recorded for this berth.</li>`;
            } else {
                [...history].reverse().forEach(record => {
                    const item = document.createElement('li');
                    item.className = 'p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg';
                    const statusPill = record.status === 'Berthed'
                        ? `<span class="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 dark:text-green-100 dark:bg-green-500/50 rounded-full">Active</span>`
                        : `<span class="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-200 dark:text-slate-300 dark:bg-slate-600/50 rounded-full">Departed</span>`;
                    item.innerHTML = `
                        <div class="flex justify-between items-center">
                            <p class="font-bold text-lg text-indigo-600 dark:text-indigo-400">${record.vesselName}</p>
                            ${statusPill}
                        </div>
                        <div class="text-xs text-slate-600 dark:text-slate-300 mt-2 grid grid-cols-2 gap-2">
                           <p><strong>Berthed:</strong> ${record.berthingTime.toLocaleString()}</p>
                           <p><strong>Departure:</strong> ${record.departureTime.toLocaleString()}</p>
                        </div>`;
                    list.appendChild(item);
                });
            }

            modal.classList.remove('modal-hidden');
            modal.style.display = 'flex';
            setTimeout(() => { 
                modal.style.opacity = 1;
                modal.querySelector('.glass-card').style.transform = 'scale(1)';
            }, 10);
        }

        function closeBerthHistoryModal() {
            const modal = document.getElementById('berth-history-modal');
            modal.style.opacity = 0;
            modal.querySelector('.glass-card').style.transform = 'scale(0.95)';
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.add('modal-hidden');
            }, 300);
        }

        function renderWaitingList(){
            const e=document.getElementById("waiting-vessels-list");
            e.innerHTML="";
            const t=vessels.filter(e=>"Waiting"===e.status).sort((e,t)=>e.arrivalTime-t.arrivalTime);
            if(0===t.length){
                e.innerHTML='<p class="text-sm text-slate-600 dark:text-slate-400 text-center py-4">No vessels are currently waiting.</p>';
                return
            }
            t.forEach(t=>{
                const s=document.createElement("div");
                s.className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg",
                s.innerHTML=`
                <div class="flex justify-between items-center">
                    <p class="font-semibold text-slate-800 dark:text-slate-200">${t.name}</p>
                    <span class="text-xs font-medium text-amber-600 dark:text-amber-400">Waiting</span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Arrival: ${t.arrivalTime.toLocaleString()}
                </p>`,
                e.appendChild(s)
            })
        }

        function renderAnalytics(){
            const e=document.getElementById("analytics-content"),
            t=vessels.filter(e=>"Berthed"===e.status).length,
            s=vessels.filter(e=>"Waiting"===e.status).length;
            
            e.innerHTML=`
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Vessels Berthed</p>
                    <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">${t}</p>
                </div>
            </div>
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Vessels Waiting</p>
                    <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">${s}</p>
                </div>
            </div>                
            </div>
            <div class="flex items-start gap-4 pt-2">
                <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Total Time Optimized</p>
                    <p class="text-2xl font-bold text-green-600 dark:text-green-400">${totalTimeOptimizedForDay.toFixed(2)} <span class="text-lg font-medium">hours</span></p>
                </div>
            </div>
            <p class="text-xs text-center text-slate-600 dark:text-slate-400 pt-2">Sim Time: ${simulationTime.toLocaleString()}</p>`
        }

        function renderAllotmentPlan(){
            const e=document.getElementById("allotment-plan-body");
            e.innerHTML="";
            const t=vessels.filter(e=>"Berthed"===e.status&&e.id&&e.id.startsWith(`V-waiting-${currentDay}`)).sort((e,t)=>e.berthingTime-t.berthingTime);
            if(0===t.length){
                e.innerHTML='<tr><td colspan="5" class="text-center text-slate-600 dark:text-slate-400 py-8">Run optimization to generate an allotment plan.</td></tr>';
                return
            }
            t.forEach(t=>{
                const s=berths.find(e=>e.id===t.assignedBerthId),
                l=(Math.max(0,t.berthingTime-t.arrivalTime)/36e5).toFixed(2),
                n=document.createElement("tr");
                n.className="border-b border-slate-200 dark:border-slate-700",
                n.innerHTML=`
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-100">${t.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">${s?s.name:"N/A"}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">${t.arrivalTime.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">${t.berthingTime.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 dark:text-red-400">${l} hours</td>
                `,
                e.appendChild(n)
            })
        }

        document.addEventListener('DOMContentLoaded', init);