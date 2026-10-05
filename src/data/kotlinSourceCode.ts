export interface KotlinFile {
  name: string;
  path: string;
  language: string;
  code: string;
}

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/flowtask/app/MainActivity.kt',
    language: 'kotlin',
    code: `package com.flowtask.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.flowtask.app.ui.navigation.FlowTaskNavGraph
import com.flowtask.app.ui.theme.FlowTaskTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FlowTaskTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    FlowTaskNavGraph()
                }
            }
        }
    }
}`
  },
  {
    name: 'Theme.kt',
    path: 'app/src/main/java/com/flowtask/app/ui/theme/Theme.kt',
    language: 'kotlin',
    code: `package com.flowtask.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val FlowTaskBlue = Color(0xFF3A65F0)
val FlowTaskBlueLight = Color(0xFF6B8EFF)
val FlowTaskBlueDark = Color(0xFF1E42C2)
val FlowTaskBackground = Color(0xFFF8FAFC)
val FlowTaskSurface = Color(0xFFFFFFFF)
val FlowTaskTextPrimary = Color(0xFF0F172A)
val FlowTaskTextSecondary = Color(0xFF64748B)

private val LightColorScheme = lightColorScheme(
    primary = FlowTaskBlue,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFE0E7FF),
    onPrimaryContainer = Color(0xFF1E3A8A),
    background = FlowTaskBackground,
    surface = FlowTaskSurface,
    onBackground = FlowTaskTextPrimary,
    onSurface = FlowTaskTextPrimary,
)

@Composable
fun FlowTaskTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography,
        content = content
    )
}`
  },
  {
    name: 'TaskViewModel.kt',
    path: 'app/src/main/java/com/flowtask/app/viewmodel/TaskViewModel.kt',
    language: 'kotlin',
    code: `package com.flowtask.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.flowtask.app.data.model.Project
import com.flowtask.app.data.model.Task
import com.flowtask.app.data.repository.TaskRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class TaskViewModel(
    private val repository: TaskRepository = TaskRepository()
) : ViewModel() {

    private val _tasks = MutableStateFlow<List<Task>>(emptyList())
    val tasks: StateFlow<List<Task>> = _tasks.asStateFlow()

    private val _projects = MutableStateFlow<List<Project>>(emptyList())
    val projects: StateFlow<List<Project>> = _projects.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        viewModelScope.launch {
            _tasks.value = repository.getInitialTasks()
            _projects.value = repository.getInitialProjects()
        }
    }

    fun toggleTask(taskId: String) {
        _tasks.value = _tasks.value.map { task ->
            if (task.id == taskId) {
                task.copy(isCompleted = !task.isCompleted)
            } else task
        }
    }

    fun addTask(task: Task) {
        _tasks.value = listOf(task) + _tasks.value
    }

    fun deleteTask(taskId: String) {
        _tasks.value = _tasks.value.filter { it.id != taskId }
    }
}`
  },
  {
    name: 'DashboardScreen.kt',
    path: 'app/src/main/java/com/flowtask/app/ui/screens/DashboardScreen.kt',
    language: 'kotlin',
    code: `package com.flowtask.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.flowtask.app.ui.components.ProjectProgressCard
import com.flowtask.app.ui.components.TaskCard
import com.flowtask.app.viewmodel.TaskViewModel

@Composable
fun DashboardScreen(
    viewModel: TaskViewModel,
    onNavigateToTasks: () -> Unit,
    onNavigateToProjects: () -> Unit
) {
    val tasks by viewModel.tasks.collectAsState()
    val projects by viewModel.projects.collectAsState()

    val pendingCount = tasks.count { !it.isCompleted }
    val completedCount = tasks.count { it.isCompleted }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Olá, Luccas 👋", style = MaterialTheme.typography.titleLarge) }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatMetricCard("Pendentes", pendingCount.toString(), Modifier.weight(1f))
                    StatMetricCard("Concluídas", completedCount.toString(), Modifier.weight(1f))
                }
            }

            item {
                Text("Progresso dos Projetos", style = MaterialTheme.typography.titleMedium)
            }

            items(projects) { project ->
                ProjectProgressCard(project)
            }

            item {
                Text("Tarefas Recentes", style = MaterialTheme.typography.titleMedium)
            }

            items(tasks.take(4)) { task ->
                TaskCard(
                    task = task,
                    onToggle = { viewModel.toggleTask(task.id) }
                )
            }
        }
    }
}`
  },
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.flowtask.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.flowtask.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
}`
  }
];
