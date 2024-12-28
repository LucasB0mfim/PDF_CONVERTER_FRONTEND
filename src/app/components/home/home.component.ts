import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly _homeService = inject(HomeService);
  selectedFile: File | null = null;
  isLoading: boolean = false;
  invalidFileMessage: boolean = false;
  nullFileMessage: boolean = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onHome() {
    if (!this.selectedFile) {
      console.log('Nenhum arquivo selecionado.');
      this.nullFileMessage = true;
      return;
    }

    this.invalidFileMessage = false;
    this.nullFileMessage = false;
    this.isLoading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this._homeService.home(formData).subscribe({
      next: (response: Blob) => {
        // Criar URL do blob
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Criar link para download
        const link = document.createElement('a');
        link.href = url;
        link.download = this.selectedFile?.name.replace('.docx', '.pdf') || 'documento.pdf';

        // Simular clique para iniciar o download
        document.body.appendChild(link);
        link.click();

        // Limpar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('Arquivo convertido com sucesso!');
        this.isLoading = false;
      },
      error: () => {
        console.error('Arquivo inválido! Selecione um arquivo .docx');

        this.isLoading = false;
        this.invalidFileMessage = true;
        this.selectedFile = null;
      }
    });
  }
}
