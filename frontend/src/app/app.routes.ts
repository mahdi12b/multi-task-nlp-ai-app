import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ImageGeneratorComponent } from './pages/image-generator/image-generator.component';
import { TextAnalysisComponent } from './pages/text-analysis/text-analysis.component';
import { VoiceAssistantComponent } from './pages/voice-assistant/voice-assistant.component';
import { HistoryComponent } from './pages/history/history.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { RagCsvComponent } from './pages/rag/rag-csv/rag-csv.component';
import { RagDatabaseComponent } from './pages/rag/rag-database/rag-database.component';
import { RagWebComponent } from './pages/rag/rag-web/rag-web.component';
import { TextSummarizerComponent } from './pages/text-summarizer/text-summarizer.component';
import { NerComponent } from './pages/ner/ner.component';



export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'text-summarizer', component: TextSummarizerComponent },
  { path: 'image-generator', component: ImageGeneratorComponent },
  { path: 'text-analysis', component: TextAnalysisComponent },
  { path: 'voice-assistant', component: VoiceAssistantComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'rag/rag-csv', component: RagCsvComponent },
  { path: 'rag/rag-web', component: RagWebComponent },
  { path: 'rag/rag-db', component: RagDatabaseComponent },
  { path: 'ner', component: NerComponent },
  { path: '**', redirectTo: '' }
];




